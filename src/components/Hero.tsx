import { merri } from '@/app/fonts/merri'
import Navbar from './Navbar'
import NavbarScroll from './NavbarScroll'

export default function HeroSection() {
  return (
    <section className="relative w-full flex-1 min-h-0 overflow-hidden">

      {/* ── Desktop / tablet (sm+) ─────────────────────────────────────── */}
      <div className="hidden sm:flex w-full h-full items-stretch overflow-hidden">

        {/* Left character — object-contain keeps full image visible; transparent
            areas show the page's blue texture background */}
        <div className="flex-1 overflow-hidden -ml-20 flex items-end">
          <img
            src="Web_Assets-02.png"
            alt="Left character"
            className="w-full h-full object-contain object-bottom"
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

        {/* Right character — same contain treatment */}
        <div className="flex-1 overflow-hidden -mr-20 flex items-end">
          <img
            src="Web_Assets-09.png"
            alt="Right character"
            className="w-full h-full object-contain object-bottom"
          />
        </div>
      </div>

      {/* ── Mobile (below sm) ──────────────────────────────────────────── */}
      {/*
       * Characters fill the full section height as an absolutely-positioned
       * backdrop (same feel as desktop — faces visible, bleeding from edges).
       * Circle + tagline float centred on top via a z-10 overlay column.
       */}
      <div className="sm:hidden relative h-full overflow-hidden">

        {/* Character backdrop — full-height row behind everything */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 overflow-hidden">
            <img
              src="/Web_Assets-02.png"
              alt="Left character"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <img
              src="/Web_Assets-09.png"
              alt="Right character"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Overlay: circle + tagline centred */}
        <div className="relative z-10 h-full flex flex-col items-center justify-start pt-6 px-8">
          <div className="w-[65%]">
            <img src="/Web_Assets-08.png" alt="Mahabharata Dialogues" className="w-full" />
          </div>
          <p
            className={`${merri.className} text-white text-center text-sm font-medium italic mt-3 drop-shadow-md`}
          >
            Stories from the past. Conversations for today.
          </p>
        </div>

      </div>
    </section>
  )
}
