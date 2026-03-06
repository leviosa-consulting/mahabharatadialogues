import RetreatHero from '@/components/RetreatHero'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retreats | Mahabharata Dialogues',
  description:
    'A 2-day immersive residential experience that brought the Mahabharata alive through stories, dialogue, games, art, and reflection.',

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
