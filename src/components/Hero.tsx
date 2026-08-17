import { merri } from '@/app/fonts/merri'
import Navbar from './Navbar'
import NavbarScroll from './NavbarScroll'

export default function HeroSection() {
  return (
    /*
     * Single unified layout for all screen sizes.
     * Three-column flex row: [left character] [centre] [right character]
     * Characters peek in from the sides at every breakpoint — same design
     * intent on mobile and desktop. Only the centre column contents change
     * (full navbar on lg+, circle logo on smaller screens).
     */
    <section className="relative w-full flex-1 min-h-0 overflow-hidden">
      <div className="flex w-full h-full items-stretch overflow-hidden">

        {/* ── Left character ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden -ml-8 sm:-ml-16 lg:-ml-20">
          <img
            src="Web_Assets-02.png"
            alt="Left character"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* ── Centre column ───────────────────────────────────────────── */}
        <div className="flex flex-col items-center shrink-0 w-[45%] sm:w-auto">

          {/* Full navbar — large screens only */}
          <div className="hidden lg:flex mt-10">
            <Navbar textColor="#fff" />
            <NavbarScroll textColor="#1D5C75" />
          </div>

          {/* Circle logo — all screens below lg */}
          <div className="lg:hidden flex items-center justify-center mt-4 sm:mt-6 w-full px-2">
            <img
              src="/Web_Assets-08.png"
              alt="Mahabharata Dialogues"
              className="w-full max-w-[200px] sm:max-w-[220px]"
            />
          </div>

          {/* Tagline — always visible */}
          <p
            className={`${merri.className} text-white text-center text-xs sm:text-sm lg:text-base font-medium italic mt-3 px-3 sm:px-6 drop-shadow-md`}
          >
            Stories from the past.
            <br />
            Conversations for today.
          </p>
        </div>

        {/* ── Right character ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden -mr-8 sm:-mr-16 lg:-mr-20">
          <img
            src="Web_Assets-09.png"
            alt="Right character"
            className="w-full h-full object-cover object-top"
          />
        </div>

      </div>
    </section>
  )
}
