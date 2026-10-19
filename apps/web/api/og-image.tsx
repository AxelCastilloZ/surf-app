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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Wave decoration */}
        <svg
          viewBox="0 0 1200 200"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '200px',
            opacity: 0.15,
          }}
        >
          <path
            d="M0,120 C200,40 400,180 600,100 C800,20 1000,160 1200,80 L1200,200 L0,200 Z"
            fill="white"
          />
          <path
            d="M0,160 C200,100 400,200 600,140 C800,80 1000,180 1200,120 L1200,200 L0,200 Z"
            fill="white"
            opacity="0.5"
          />
        </svg>

        {/* Surfboard icon */}
        <svg
          viewBox="0 0 80 200"
          style={{
            width: '60px',
            height: '150px',
            marginBottom: '16px',
            opacity: 0.9,
          }}
        >
          <ellipse cx="40" cy="100" rx="28" ry="90" fill="none" stroke="white" strokeWidth="3" />
          <line x1="40" y1="15" x2="40" y2="185" stroke="white" strokeWidth="2" opacity="0.6" />
        </svg>

        {/* Brand name */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-1px',
            display: 'flex',
          }}
        >
          SURFERS LAB CR
        </div>

        {/* Accent bar */}
        <div
          style={{
            width: '80px',
            height: '4px',
            background: '#f97316',
            borderRadius: '2px',
            margin: '16px 0',
            display: 'flex',
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.85)',
            display: 'flex',
          }}
        >
          Surf School in Nosara, Costa Rica
        </div>

        {/* Services */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            marginTop: '24px',
          }}
        >
          {['Surf Lessons', 'Video Analysis', 'Surf Trips'].map((s) => (
            <div
              key={s}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#f97316',
                background: 'rgba(255,255,255,0.1)',
                padding: '8px 20px',
                borderRadius: '20px',
                display: 'flex',
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
