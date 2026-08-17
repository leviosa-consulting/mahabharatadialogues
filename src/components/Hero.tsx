import { merri } from '@/app/fonts/merri'
import Navbar from './Navbar'
import NavbarScroll from './NavbarScroll'

export default function HeroSection() {
  return (
    /*
     * Unified 3-column flex row for all screen sizes.
     * Characters bleed in from the edges; centre column holds
     * circle logo + tagline (and the full navbar on lg+).
     */
    <section className="relative w-full flex-1 min-h-0 overflow-hidden">
      <div className="flex w-full h-full items-stretch overflow-hidden">

        {/* ── Left character ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden -ml-12 sm:-ml-16 lg:-ml-20">
          <img
            src="Web_Assets-02.png"
            alt="Left character"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* ── Centre column ───────────────────────────────────────────── */}
        {/*
         * Mobile: narrower (36%) so characters fill more of the screen
         * and the centre seam is less prominent.
         * sm+: auto width driven by the navbar / circle content.
         */}
        <div className="flex flex-col items-center justify-start shrink-0 w-[36%] sm:w-auto">

          {/* Full navbar — large screens only */}
          <div className="hidden lg:flex mt-10">
            <Navbar textColor="#fff" />
            <NavbarScroll textColor="#1D5C75" />
          </div>

          {/* Circle logo — below lg */}
          <div className="lg:hidden flex items-center justify-center mt-4 sm:mt-6 w-full">
            <img
              src="/Web_Assets-08.png"
              alt="Mahabharata Dialogues"
              className="w-full max-w-[190px] sm:max-w-[220px]"
            />
          </div>

          {/* Tagline */}
          <p
            className={`${merri.className} text-white w-full text-center text-[0.6rem] leading-snug sm:text-sm lg:text-base font-medium italic mt-2 sm:mt-3 px-1 sm:px-6 drop-shadow-md`}
          >
            Stories from the past.
            <br />
            Conversations for today.
          </p>
        </div>

        {/* ── Right character ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden -mr-12 sm:-mr-16 lg:-mr-20">
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
