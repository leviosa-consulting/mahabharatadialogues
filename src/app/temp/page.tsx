import React from 'react'

const Temp = () => {
  return (
    <div
  className="w-full h-screen"
  style={{
    backgroundImage: `
      linear-gradient(
        to top,     
        rgba(255, 255, 255, 0.92),
        rgba(45, 156, 207, 0.92)
      ),
      url('/Blue_Background_with_Texture-02.png')
    `,
    backgroundSize: 'cover, contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}
></div>

  )
}

export default Temp
