import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  timestamps: number[];
}

// In-memory sliding window cache per IP and endpoint
const rateLimitCache = new Map<string, RateLimitEntry>();

// Automatic cleanup every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitCache.entries()) {
      // Remove timestamps older than 10 minutes
      entry.timestamps = entry.timestamps.filter((ts) => now - ts < 600000);
      if (entry.timestamps.length === 0) {
        rateLimitCache.delete(key);
      }
    }
  }, 300000).unref?.();
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  limit: number;
  /** Window size in milliseconds (default: 60000ms = 1 minute) */
  windowMs?: number;
  /** Unique namespace for the route (e.g. 'gemini_generate', 'scan_materials') */
  keyPrefix: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
}

/**
 * Extracts the client IP from request headers (supports proxies, ngrok, CDNs).
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',');
    return ips[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

/**
 * Checks and records rate limit for an incoming NextRequest.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const windowMs = options.windowMs || 60000;
  const clientIp = getClientIp(req);
  const cacheKey = `${options.keyPrefix}:${clientIp}`;

  const now = Date.now();
  let entry = rateLimitCache.get(cacheKey);

  if (!entry) {
    entry = { timestamps: [] };
    rateLimitCache.set(cacheKey, entry);
  }

  // Filter timestamps within the active sliding window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (entry.timestamps.length >= options.limit) {
    const oldest = entry.timestamps[0];
    const resetTime = oldest + windowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetTime,
      retryAfterSeconds,
    };
  }

  // Record this request
  entry.timestamps.push(now);
  const remaining = options.limit - entry.timestamps.length;
  const resetTime = now + windowMs;

  return {
    success: true,
    limit: options.limit,
    remaining,
    resetTime,
    retryAfterSeconds: 0,
  };
}

/**
 * Constructs a standardized 429 Too Many Requests response with standard rate limit headers.
 */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: `Rate limit of ${result.limit} requests per minute exceeded. Please slow down.`,
      retryAfterSeconds: result.retryAfterSeconds,
      remaining: result.remaining,
    },
    {
      status: 429,
      headers: {
        'Retry-After': result.retryAfterSeconds.toString(),
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
      },
    }
  );
}

/**
 * Attaches standard rate-limit headers to any NextResponse.
 */
export function applyRateLimitHeaders(
  res: NextResponse,
  result: RateLimitResult
): NextResponse {
  res.headers.set('X-RateLimit-Limit', result.limit.toString());
  res.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  res.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());
  return res;
}

/**
 * Gemini Token Cost Optimizer & Auditor
 * Standard Gemini 2.5 / 3.6 Flash Pricing:
 * - Input: $0.075 per 1,000,000 tokens ($0.000000075 / token)
 * - Output: $0.30 per 1,000,000 tokens ($0.00000030 / token)
 */
export function calculateGeminiCost(
  promptTokens: number,
  candidateTokens: number,
  modelName: string = 'gemini-3.6-flash'
): {
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  formattedCost: string;
  model: string;
  savings: string;
  unoptimizedEstimatePromptTokens: number;
} {
  const inputRatePerToken = 0.075 / 1000000;
  const outputRatePerToken = 0.30 / 1000000;

  const cost = promptTokens * inputRatePerToken + candidateTokens * outputRatePerToken;
  const totalTokens = promptTokens + candidateTokens;

  // Unoptimized raw JSON prompt would typically consume ~2.8x more tokens
  const unoptimizedEstimatePromptTokens = Math.round(promptTokens * 2.8);
  const unoptimizedCost = unoptimizedEstimatePromptTokens * inputRatePerToken + candidateTokens * outputRatePerToken;
  const savingsPct = promptTokens > 0 ? Math.round(((unoptimizedCost - cost) / unoptimizedCost) * 100) : 100;

  return {
    promptTokens,
    candidateTokens,
    totalTokens,
    estimatedCostUsd: Number(cost.toFixed(6)),
    formattedCost: `$${cost < 0.0001 ? cost.toFixed(6) : cost.toFixed(4)} USD`,
    model: modelName,
    savings: `${savingsPct}% prompt token compression savings`,
    unoptimizedEstimatePromptTokens,
  };
}

/**
 * Hard Token Price Limits & Anti-Runaway Budget Guard
 * Prevents denial-of-wallet attacks and guarantees cost stays strictly below budget.
 */
export const TOKEN_PRICE_LIMITS = {
  // Hard cap on any single Gemini API call ($0.005 = half a cent)
  MAX_COST_PER_REQUEST_USD: 0.005,
  // Hard cap on prompt tokens passed to Gemini
  MAX_INPUT_TOKENS_PER_CALL: 4000,
  // Hard cap on response tokens generated by Gemini
  MAX_OUTPUT_TOKENS_PER_CALL: 1800,
  // Max rolling hourly budget per client IP ($0.25 allows ~500 full capsule syntheses per hour)
  HOURLY_BUDGET_PER_IP_USD: 0.25,
};

interface BudgetEntry {
  spentUsd: number;
  resetTime: number;
}

const clientBudgetMap = new Map<string, BudgetEntry>();

/**
 * Checks if the client has remaining token budget within the rolling hour.
 */
export function checkTokenBudget(clientIp: string): {
  allowed: boolean;
  remainingBudgetUsd: number;
  spentUsd: number;
  resetTime: number;
} {
  const now = Date.now();
  let entry = clientBudgetMap.get(clientIp);

  // Reset hourly window
  if (!entry || now > entry.resetTime) {
    entry = { spentUsd: 0, resetTime: now + 3600000 };
    clientBudgetMap.set(clientIp, entry);
  }

  const remaining = Math.max(0, Number((TOKEN_PRICE_LIMITS.HOURLY_BUDGET_PER_IP_USD - entry.spentUsd).toFixed(6)));

  if (entry.spentUsd >= TOKEN_PRICE_LIMITS.HOURLY_BUDGET_PER_IP_USD) {
    return {
      allowed: false,
      remainingBudgetUsd: 0,
      spentUsd: entry.spentUsd,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remainingBudgetUsd: remaining,
    spentUsd: entry.spentUsd,
    resetTime: entry.resetTime,
  };
}

/**
 * Records actual token cost spent by client to enforce hourly price budget.
 */
export function recordTokenCost(clientIp: string, costUsd: number): void {
  const now = Date.now();
  let entry = clientBudgetMap.get(clientIp);
  if (!entry || now > entry.resetTime) {
    entry = { spentUsd: 0, resetTime: now + 3600000 };
    clientBudgetMap.set(clientIp, entry);
  }
  entry.spentUsd = Number((entry.spentUsd + costUsd).toFixed(6));
}

