import RetreatHero from '@/components/RetreatHero'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retreats',
  description:
    'A 2-day immersive residential experience that brought the Mahabharata alive through stories, dialogue, games, art, and reflection.',

  alternates: {
    canonical: 'https://mahabharatadialogues.com/retreats',
  },

  openGraph: {
    title: 'Retreats | Mahabharata Dialogues',
    description:
      'A 2-day immersive residential experience that brought the Mahabharata alive through stories, dialogue, games, art, and reflection.',
    url: 'https://mahabharatadialogues.com/retreats',
    type: 'website',
    images: [
      {
        url: '/retreats30.jpeg',
        width: 1200,
        height: 630,
        alt: 'Mahabharata Dialogues Retreat',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Retreats | Mahabharata Dialogues',
    description:
      'A 2-day immersive residential experience that brought the Mahabharata alive through stories, dialogue, games, art, and reflection.',
    images: ['/retreat30.jpg'],
  },
}

const RetreatsPage: React.FC = () => {
  return (
    <div>
      <RetreatHero />
    </div>
  )
}

export default RetreatsPage