import { merri } from '@/app/fonts/merri'
import Navbar from './Navbar'
import NavbarScroll from './NavbarScroll'

export default function HeroSection() {
  return (
    <section className="relative w-full flex-1 min-h-0 overflow-hidden">

      {/* ── Desktop / tablet (sm+): 3-column flex row ───────────────────
       *  Characters bleed in from the edges; contain+bottom shows the
       *  full portrait without bottom-cropping.
       */}
      <div className="hidden sm:flex w-full h-full items-stretch overflow-hidden">

        <div className="flex-1 overflow-hidden -ml-16 lg:-ml-20">
          <img
            src="Web_Assets-02.png"
            alt="Left character"
            className="w-full h-full object-contain object-bottom"
          />
        </div>

        <div className="flex flex-col items-center justify-start shrink-0">
          <div className="hidden lg:flex mt-10">
            <Navbar textColor="#fff" />
            <NavbarScroll textColor="#1D5C75" />
          </div>
          <div className="lg:hidden flex items-center justify-center mt-6 w-full px-2">
            <img
              src="/Web_Assets-08.png"
              alt="Mahabharata Dialogues"
              className="w-full max-w-[220px]"
            />
          </div>
          <p className={`${merri.className} text-white text-center text-sm lg:text-base font-medium italic mt-4 px-6 drop-shadow-md`}>
            Stories from the past.
            <br />
            Conversations for today.
          </p>
        </div>

        <div className="flex-1 overflow-hidden -mr-16 lg:-mr-20">
          <img
            src="Web_Assets-09.png"
            alt="Right character"
            className="w-full h-full object-contain object-bottom"
          />
        </div>

      </div>

      {/* ── Mobile (below sm): clean stacked layout — zero overlap ────────
       *  Zone 1 (top):    Circle logo, centred
       *  Zone 2 (middle): Characters side-by-side, prominent
       *  Zone 3 (bottom): Tagline text
       */}
      <div className="sm:hidden w-full h-full flex flex-col overflow-hidden">

        {/* Circle logo */}
        <div className="flex justify-center pt-3">
          <img
            src="/Web_Assets-08.png"
            alt="Mahabharata Dialogues"
            className="w-[65%] max-w-[260px]"
          />
        </div>

        {/* Characters — prominent, fills most of remaining height */}
        <div className="flex h-[min(90vw,340px)] -mt-[20vw] relative z-10 overflow-hidden gap-10">
          <div className="flex-1 overflow-hidden">
            <img
              src="/Web_Assets-02.png"
              alt="Left character"
              className="w-full h-full object-contain object-top"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <img
              src="/Web_Assets-09.png"
              alt="Right character"
              className="w-full h-full object-contain object-top"
            />
          </div>
        </div>

        {/* Tagline — below characters */}
        <p className={`${merri.className} text-white text-center text-xs font-medium italic mt-2 mb-1 px-6 drop-shadow-md`}>
          Stories from the past. Conversations for today.
        </p>

      </div>

    </section>
  )
}
