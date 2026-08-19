import React from 'react'
import CustomButton from './CustomButton'

const ImageCarousel = () => {
  const images = [
    'first.png',
    'second.png',
    'third.png',
    'four.png',
    'five.png',
    'six.png',
    'seven.png',
    'eight.png',
  ]

  return (
    <section
      className=" w-full overflow-hidden flex flex-col justify-center gap-4 pt-8 md:pt-6 pb-8 md:pb-6"
      // style={{
      //   backgroundImage: `url('/Blue_Background_with_Texture-01.png')`,
      //   backgroundSize: 'cover',
      //   backgroundRepeat: 'no-repeat',
      //   backgroundPosition: 'center ', 
      // }}
    >
      <style>{`
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .carousel-right {
          animation: scrollRight 30s linear infinite;
        }

        /* Pause under the pointer and resume from the same position on leave.
           Guarded because a tap on touch devices can leave :hover stuck, which
           would freeze the strip until the user taps elsewhere. */
        @media (hover: hover) and (pointer: fine) {
          .carousel-right:hover {
            animation-play-state: paused;
          }
        }

        /* Slower on mobile */
        @media (max-width: 768px) {
          .carousel-right {
            animation-duration: 45s;
          }
        }
      `}</style>

      {/* CAROUSEL — the sequence is repeated exactly twice so the -50% translate
          lands on an identical frame. pr-* must stay equal to gap-*: it stands in
          for the final gap, which is what makes the track perfectly periodic. */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 md:gap-8 carousel-right pr-4 md:pr-8 w-max">
          {[...images, ...images].map((img, idx) => (
            <div
              key={idx}
              className="shrink-0 w-[260px] md:w-[clamp(250px,44vh,440px)] aspect-115/79"
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
      <div className="flex justify-center items-center mx-4">
        <CustomButton
          text="MORE CLIPS OF OUR DIALOGUES"
          bgColor="#1D5C75"
          textColor="#FFFFFF"
          isOutSideLink
          url="https://www.instagram.com/mahabharatadialogues"
        />
      </div>
    </section>
  )
}

export default ImageCarousel
