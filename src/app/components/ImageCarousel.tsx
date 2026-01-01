import React from 'react'

const ImageCarousel = () => {
  return (
    <section
      className="relative w-full h-screen overflow-hidden -mt-30"
      style={{
        backgroundImage: `url('/Blue_Background_with_Texture-01.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {[
          'first.png',
          'second.png',
          'third.png',
          'four.png',
          'five.png',
          'six.png',
          'seven.png',
          'eight.png',
        ].map((img, idx) => (
          <div key={idx} className="w-full aspect-115/79 overflow-hidden">
            <img
              src={`/assets/${img}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ImageCarousel
