import React from 'react'
import CustomButton from './CustomButton'

const ImageCarousel = () => {
  const topImages = ['first.png', 'second.png', 'third.png', 'four.png']
  const bottomImages = ['five.png', 'six.png', 'seven.png', 'eight.png']

  return (
    <section
      className=" w-full overflow-hidden flex flex-col justify-center gap-8 pb-20 "
      style={{
        backgroundImage: `url('/Blue_Background_with_Texture-01.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center ', 
      }}
    >
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .carousel-left {
          animation: scrollLeft 30s linear infinite;
        }

        .carousel-right {
          animation: scrollRight 30s linear infinite;
        }

        /* Slower on mobile */
        @media (max-width: 768px) {
          .carousel-left,
          .carousel-right {
            animation-duration: 45s;
          }
        }
      `}</style>

      {/* TOP CAROUSEL */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 md:gap-8 carousel-right pr-4 md:pr-8 w-max">
          {[...topImages, ...topImages, ...topImages, ...topImages].map(
            (img, idx) => (
              <div
                key={idx}
                className="shrink-0 w-[360px]  md:w-[460px] aspect-115/79"
              >
                <img
                  src={`/assets/${img}`}
                  alt=""
                  className="w-full h-full object-cover shadow-lg"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* BOTTOM CAROUSEL */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 md:gap-8 carousel-left pr-4 md:pr-8 w-max">
          {[
            ...bottomImages,
            ...bottomImages,
            ...bottomImages,
            ...bottomImages,
          ].map((img, idx) => (
            <div
              key={idx}
              className="shrink-0 w-[360px]  md:w-[460px] aspect-115/79"
            >
              <img
                src={`/assets/${img}`}
                alt=""
                className="w-full h-full object-cover shadow-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* button */}
      <div className="flex justify-center items-center mt-2">
        <CustomButton
          text="MORE CLIPS OF OUR DIALOGUES"
          bgColor="#1D5C75"
          textColor="#FFFFFF"
          url="https://www.instagram.com/mahabharatadialogues"
        />
      </div>
    </section>
  )
}

export default ImageCarousel
