import { merri } from '@/app/fonts/merri'
import Navbar from './Navbar'
import NavbarScroll from './NavbarScroll'

export default function HeroSection() {
  return (
    /*
     * Parent: flex flex-col h-dvh (in page.tsx), so this section has a
     * known height = dvh minus the CTAStrip below it. Image containers can
     * safely use h-full inside a row with items-stretch.
     */
    <section className="relative w-full flex-1 min-h-0 overflow-hidden">

      {/* ── Desktop / tablet (sm+) ─────────────────────────────────────── */}
      {/*
       * items-stretch: flex items grow to the full row height so the image
       * containers are height-bounded by the section.  object-top on the
       * images then ensures the face is always visible; only the lower body
       * may be cropped if the image is taller than the viewport space.
       */}
      <div className="hidden sm:flex w-full h-full items-stretch overflow-hidden">

        {/* Left character image */}
        <div className="flex-1 overflow-hidden -ml-20">
          <img
            src="Web_Assets-02.png"
            alt="Left character"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Centre column: navbar (lg) / circle logo (sm-md) + tagline */}
        <div className="flex flex-col items-center shrink-0">
          {/* Navbar — large screens only */}
          <div className="hidden lg:flex mt-10">
            <Navbar textColor="#fff" />
            <NavbarScroll textColor="#1D5C75" />
          </div>

          {/* Circle logo — sm to md (navbar not shown) */}
          <div className="lg:hidden w-[50%] rounded-full flex items-center justify-center text-center mt-6">
            <img src="/Web_Assets-08.png" alt="Mahabharata Dialogues" />
          </div>

          {/* Tagline */}
          <p
            className={`${merri.className} text-white text-center text-sm lg:text-base font-medium italic mt-4 px-6 drop-shadow-md`}
          >
            Stories from the past.
            <br />
            Conversations for today.
          </p>
        </div>

        {/* Right character image */}
        <div className="flex-1 overflow-hidden -mr-20">
          <img
            src="Web_Assets-09.png"
            alt="Right character"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* ── Mobile (below sm) ──────────────────────────────────────────── */}
      {/*
       * Fills the same h-dvh-minus-CTA space as desktop.
       * flex-col keeps everything stacked; the character row is flex-1 so
       * it claims whatever height remains after the circle + tagline.
       * object-top on images ensures faces stay visible; feet may be cropped.
       */}
      <div className="sm:hidden h-full flex flex-col overflow-hidden">

        {/* Circle logo */}
        <div className="flex justify-center mt-4 px-12">
          <div className="w-[70%] rounded-full bg-red-500 flex items-center justify-center text-center">
            <img src="/Web_Assets-08.png" alt="Mahabharata Dialogues" />
          </div>
        </div>

        {/* Tagline */}
        <p
          className={`${merri.className} text-white text-center text-xs font-medium italic mt-3 mb-1 px-8 drop-shadow-md`}
        >
          Stories from the past. Conversations for today.
        </p>

        {/* Characters — fill remaining height, faces anchored at top */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-hidden -ml-8">
            <img
              src="/Web_Assets-02.png"
              alt="Left character"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex-1 overflow-hidden -mr-8">
            <img
              src="/Web_Assets-09.png"
              alt="Right character"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

      </div>
    </section>
  )
}
