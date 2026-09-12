import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let sharedSessionId: string | null = null;

export async function GET() {
  try {
    const applicationId = process.env.VONAGE_APPLICATION_ID;
    const privateKeyPath = process.env.VONAGE_PRIVATE_KEY_PATH || './private.key';

    if (!applicationId) {
      return NextResponse.json({
        error: 'VONAGE_APPLICATION_ID not configured in .env',
      }, { status: 500 });
    }

    let keyContent: Buffer | null = null;
    const keyFile = path.join(process.cwd(), 'private.key');
    if (fs.existsSync(keyFile)) {
      keyContent = fs.readFileSync(keyFile);
    }

    if (!keyContent) {
      return NextResponse.json({
        error: 'Vonage private key file not found at ' + privateKeyPath,
      }, { status: 500 });
    }

    const { Vonage } = await import('@vonage/server-sdk');
    const vonage = new Vonage({
      applicationId,
      privateKey: keyContent,
    });

    if (!sharedSessionId) {
      const session = await vonage.video.createSession({ mediaMode: 'routed' as any });
      sharedSessionId = session.sessionId;
    }

    const token = vonage.video.generateClientToken(sharedSessionId, {
      role: 'publisher',
      expireTime: Math.floor(Date.now() / 1000) + 24 * 3600,
      data: JSON.stringify({ user: 'designer-live', role: 'atelier_lead' }),
    });

    return NextResponse.json({
      applicationId,
      sessionId: sharedSessionId,
      token,
      connected: true,
    });
  } catch (error: any) {
    console.error('Vonage credentials error:', error);
    return NextResponse.json({
      error: error.message,
      connected: false,
    }, { status: 500 });
  }
}
