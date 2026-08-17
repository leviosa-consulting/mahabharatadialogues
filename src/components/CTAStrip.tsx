import CustomButton from './CustomButton'
import { merri } from '@/app/fonts/merri'

export default function CTAStrip() {
  return (
    <div className="flex flex-col md:flex-row shrink-0 justify-center gap-6 items-center text-center md:text-left bg-white/70 py-4 sm:py-6 xl:py-8 px-4 sm:px-10 xl:px-40">
      <p className={`text-[#1D5C75] ${merri.className} font-bold italic text-[20px] md:text-[24px]`}>
        Dialogues, Retreats, and Evenings with Mahabharata, celebrating
        art, music, dance, and stories.
      </p>
      <CustomButton
        text="EXPLORE MORE EVENTS"
        bgColor="#1D5C75"
        textColor="#FFFFFF"
        url={'/events'}
      />
    </div>
  )
}
