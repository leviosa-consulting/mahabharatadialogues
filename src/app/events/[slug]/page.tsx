// app/events/[slug]/page.tsx

import FooterWithBlogs from '@/components/FooterWithBlogs'
import EventDetailClient from './EventDetailClient'
import { cache } from 'react'
import { Metadata } from 'next'

export const revalidate = 43200

interface Event {
  id: string
  title: string
  description: string
  coverImage: string
  gallery?: string[]
  testimonial?: string
  bookingUrl?: string
  youtubeUrl?: string
  mapUrl?: string
  eventDate: string
  slug: string
  venue: string
  city?: string
}

export const metadata: Metadata = {
  title: 'Events | Mahabharata Dialogues',
  description:
    'Explore upcoming and past events, spiritual gatherings, retreats, and immersive experiences by Mahabharata Dialogues across India.',

  alternates: {
    canonical: 'https://mahabharatadialogues.com/events',
  },
}

const getEvent = cache(async (slug: string): Promise<Event | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/events/slug/${slug}`,
<<<<<<< HEAD
      {
        next: { revalidate: 43200 }, 
      }
=======
      { cache: 'no-store', signal: AbortSignal.timeout(8000) },
>>>>>>> fc2a5da (Add error handling and timeouts to server-side data fetching)
    )

    const data = await res.json()

    if (data.success) return data.data

    return null
  } catch {
    return null
  }
})

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const event = await getEvent(slug)

  if (!event) return null

  return (
    <>
      <EventDetailClient event={event} />

      <div
        style={{
          backgroundImage: `
            linear-gradient(#1D5C75CC, #1D5C75CC),
            url('/MD-Texture_BG_Blue-01-04.png')
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
        className="pt-12"
      >
        <FooterWithBlogs />
      </div>
    </>
  )
}