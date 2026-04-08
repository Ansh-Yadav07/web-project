import { Client } from 'dwolla-v2';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dwollaKey = process.env.DWOLLA_KEY as string;
    const dwollaSecret = process.env.DWOLLA_SECRET as string;
    const dwollaEnv = (process.env.DWOLLA_ENV as 'sandbox' | 'production') || 'sandbox';

    if (!dwollaKey || !dwollaSecret) {
      return NextResponse.json({ status: 'error', connected: false, message: 'Missing credentials' }, { status: 400 });
    }

    const dwollaClient = new Client({
      environment: dwollaEnv,
      key: dwollaKey,
      secret: dwollaSecret,
    });

    // A simple client token auth check is enough to verify credentials
    await dwollaClient.auth.client();

    return NextResponse.json({
      status: 'success',
      connected: true,
      environment: dwollaEnv,
      message: 'Successfully generated App Token'
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', connected: false, message: error.message || 'Request failed' },
      { status: 500 }
    );
  }
}
