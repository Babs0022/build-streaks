import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              marginRight: '20px',
            }}
          >
            🔥
          </div>
          <div>
            <div
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                marginBottom: '10px',
              }}
            >
              Build Streaks
            </div>
            <div
              style={{
                fontSize: '24px',
                opacity: 0.8,
              }}
            >
              Track Your Daily Progress
            </div>
          </div>
        </div>
        
        <div
          style={{
            fontSize: '32px',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Start your build streak today and track your daily progress on Base!
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
