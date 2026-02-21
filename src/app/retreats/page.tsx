import RetreatHero from '@/components/RetreatHero'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retreats | Mahabharata Dialogues',
  description:
    'Discover immersive spiritual retreats by Mahabharata Dialogues—experience self-reflection, ancient wisdom, guided practices, and transformative journeys inspired by the Mahabharata.',

  alternates: {
    canonical: 'https://mahabharatadialogues.com/retreats',
  },
}


const RetreatsPage: React.FC = () => {
  return (
    <div className="">
      <RetreatHero />
    </div>
  )
}

export default RetreatsPage
