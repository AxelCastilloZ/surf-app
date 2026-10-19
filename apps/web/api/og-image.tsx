import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a2f3d 0%, #155e75 40%, #0891b2 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '72px',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-2px',
            display: 'flex',
          }}
        >
          SURFERS LAB CR
        </div>

        <div
          style={{
            width: '80px',
            height: '4px',
            background: '#f97316',
            borderRadius: '2px',
            marginTop: '20px',
            marginBottom: '20px',
            display: 'flex',
          }}
        />

        <div
          style={{
            fontSize: '30px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.85)',
            display: 'flex',
          }}
        >
          Surf School in Nosara, Costa Rica
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#f97316',
              background: 'rgba(255,255,255,0.1)',
              padding: '10px 24px',
              borderRadius: '24px',
              display: 'flex',
            }}
          >
            Surf Lessons
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#f97316',
              background: 'rgba(255,255,255,0.1)',
              padding: '10px 24px',
              borderRadius: '24px',
              display: 'flex',
            }}
          >
            Video Analysis
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#f97316',
              background: 'rgba(255,255,255,0.1)',
              padding: '10px 24px',
              borderRadius: '24px',
              display: 'flex',
            }}
          >
            Surf Trips
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
