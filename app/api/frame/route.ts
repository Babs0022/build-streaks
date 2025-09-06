import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buttonIndex, untrustedData } = body;
    
    // Handle frame button interactions
    if (buttonIndex === 1) {
      // Start Streak button
      return NextResponse.json({
        type: 'frame',
        image: '/api/og?action=start',
        buttons: [
          {
            label: 'Connect Wallet',
            action: 'link',
            target: 'https://app.base.org',
          },
        ],
      });
    } else if (buttonIndex === 2) {
      // Log Today button
      return NextResponse.json({
        type: 'frame',
        image: '/api/og?action=log',
        buttons: [
          {
            label: 'Open in Base App',
            action: 'link',
            target: 'https://app.base.org',
          },
        ],
      });
    }
    
    // Default response
    return NextResponse.json({
      type: 'frame',
      image: '/api/og',
      buttons: [
        {
          label: 'Start Streak',
          action: 'post',
        },
        {
          label: 'Log Today',
          action: 'post',
        },
      ],
    });
  } catch (error) {
    console.error('Frame API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
