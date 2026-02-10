import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mahabharata Dialogues'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom, #47ABD8, #1D5C75)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        Mahabharata Dialogues
      </div>
    ),
    {
      ...size,
    }
  )
}