// app/events/[slug]/page.tsx

import FooterWithBlogs from '@/components/FooterWithBlogs'
import EventDetailClient from './EventDetailClient'
import { cache } from 'react'
import { Metadata } from 'next'

export const revalidate = 3600

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const event = await getEvent(slug)

  if (!event) {
    return {
      title: 'Event Not Found | Mahabharata Dialogues',
      description: 'The requested event could not be found.',
    }
  }

  const description =
    event.description?.replace(/<[^>]*>/g, '').slice(0, 140)+'...' ||
    'Explore upcoming and past events by Mahabharata Dialogues.'

  const imageUrl = event.coverImage?.startsWith('http')
    ? event.coverImage
    : `https://mahabharatadialogues.com${event.coverImage}`

  const eventUrl = `https://mahabharatadialogues.com/events/${event.slug}`

  return {
    title: `${event.title} | Mahabharata Dialogues`,
    description,

    openGraph: {
      title: event.title,
      description,
      url: eventUrl,
      siteName: 'Mahabharata Dialogues',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      type: 'article',
    },

    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: [imageUrl],
    },

    alternates: {
      canonical: eventUrl,
    },
  }
}

const getEvent = cache(async (slug: string): Promise<Event | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/events/slug/${slug}`,
      { cache: 'no-store', signal: AbortSignal.timeout(8000) },
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