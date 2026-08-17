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

      {/* ── Mobile (below sm): overlapping panel composition ────────────
       *  Left char covers left 60%, right char covers right 60%.
       *  They overlap 20% in the centre — the circle medallion sits
       *  exactly over that join, hiding it naturally.
       *  object-right-top / object-left-top pull the face into view
       *  for each portrait image.
       */}
      <div className="sm:hidden relative w-full h-full overflow-hidden">

        {/* Left character panel */}
        <div className="absolute left-0 top-0 w-[62%] h-full overflow-hidden">
          <img
            src="/Web_Assets-02.png"
            alt="Left character"
            className="w-full h-full object-cover object-right-top"
          />
        </div>

        {/* Right character panel */}
        <div className="absolute right-0 top-0 w-[62%] h-full overflow-hidden">
          <img
            src="/Web_Assets-09.png"
            alt="Right character"
            className="w-full h-full object-cover object-left-top"
          />
        </div>

        {/* Circle medallion + tagline — floats over the join */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-5">
          <img
            src="/Web_Assets-08.png"
            alt="Mahabharata Dialogues"
            className="w-[52%] max-w-[200px] drop-shadow-xl"
          />
          <p className={`${merri.className} text-white text-center text-xs font-medium italic mt-3 px-6 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]`}>
            Stories from the past.
            <br />
            Conversations for today.
          </p>
        </div>

      </div>

    </section>
  )
}
