'use client';

import React from 'react';

export interface TracePoint {
  x: number;
  y: number;
  label?: string;
}

export interface TraceLineOverlayProps {
  start?: TracePoint;
  end?: TracePoint;
  color?: string;
  isActive?: boolean;
  active?: boolean;
  isWarning?: boolean;
  sourceLabel?: string;
  targetLabel?: string;
  variant?: 'active' | 'alert';
}

export const TraceLineOverlay: React.FC<TraceLineOverlayProps> = ({
  start = { x: 40, y: 80 },
  end = { x: 260, y: 320 },
  color = '#4D74FF',
  isActive,
  active,
  isWarning,
  sourceLabel,
  targetLabel,
  variant,
}) => {
  const isCurrentlyActive = isActive ?? active ?? true;
  const isAlert = isWarning || variant === 'alert';
  const strokeColor = isAlert ? '#F2FF55' : color;

  if (!isCurrentlyActive) return null;

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const cx1 = start.x + dx * 0.5;
  const cy1 = start.y;
  const cx2 = start.x + dx * 0.5;
  const cy2 = end.y;

  const pathData = `M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
      {/* Background Soft Glow */}
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
        strokeOpacity="0.3"
        className="blur-[2px]"
      />

      {/* Main Animated Line with Traveling Dash */}
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="6 4"
        className={isAlert ? 'trace-line-warning' : 'trace-line-active'}
      />

      {/* Origin Point Pin */}
      <circle cx={start.x} cy={start.y} r="3" fill={strokeColor} />

      {/* Destination Target Pin */}
      <circle
        cx={end.x}
        cy={end.y}
        r="4"
        fill="#080A18"
        stroke={strokeColor}
        strokeWidth="2"
      />

      {sourceLabel && (
        <text
          x={start.x + 8}
          y={start.y + 4}
          fill={strokeColor}
          fontSize="9"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {sourceLabel}
        </text>
      )}

      {targetLabel && (
        <text
          x={end.x + 8}
          y={end.y + 4}
          fill={strokeColor}
          fontSize="9"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {targetLabel}
        </text>
      )}
    </svg>
  );
};
