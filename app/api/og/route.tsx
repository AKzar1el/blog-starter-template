import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Professional Blog';
    const author = searchParams.get('author') || 'AKzar1el';
    const category = searchParams.get('category') || 'Insights';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#030712',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1f2937 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1f2937 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px',
            position: 'relative',
          }}
        >
          {/* Border Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '12px solid transparent',
              borderImage: 'linear-gradient(to right, #8b5cf6, #3b82f6) 1',
              pointerEvents: 'none',
            }}
          />

          {/* Top Row: Category and Blog Branding */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#a78bfa',
                background: 'rgba(139, 92, 246, 0.1)',
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              {category}
            </span>
            <span
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#f3f4f6',
              }}
            >
              🚀 blog-starter-template
            </span>
          </div>

          {/* Title Row */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '40px', marginBottom: '40px' }}>
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.2,
                margin: 0,
                padding: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom Row: Author details */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1f2937', paddingTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                }}
              >
                <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>
                  {author.charAt(0).toUpperCase()}
                </span>
              </div>
              <span style={{ fontSize: '24px', fontWeight: '500', color: '#e5e7eb' }}>
                {author}
              </span>
            </div>
            <span style={{ fontSize: '20px', color: '#9ca3af' }}>
              read article →
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
