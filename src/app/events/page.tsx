import FooterWithBlogs from '@/components/FooterWithBlogs'
import EventsClient from './EventsClient'
import { Metadata } from 'next'
import { cache } from 'react'
interface EventData {
  id: string
  title: string
  coverImage: string
  eventDate: string
  eventTime?: string
  venue: string
  mapUrl?: string
  city?: string
  description?: string
  bookingUrl?: string
  slug?: string
  gallery?: string[]
}

interface Event {
  id: string
  type: 'event' | 'retreat'
  title: string
  coverImage: string
  date: string
  time: string
  venue: string
  mapUrl: string
  description: string
  bookingUrl?: string
  slug?: string
  endDate?: string
  city?: string
  gallery?: string[]
}

export const metadata: Metadata = {
  title: 'Events | Mahabharata Dialogues',
  description:
    'Explore upcoming and past events, spiritual gatherings, retreats, and immersive experiences by Mahabharata Dialogues',

  alternates: {
    canonical: 'https://mahabharatadialogues.com/events',
  },
}



const getEvents = cache(async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'
    const response = await fetch(`${baseUrl}/api/events`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) throw new Error('Failed to fetch events')

    const data = await response.json()

    if (!data.success || !data.data) {
      return { upcoming: [], past: [] }
    }

    const now = new Date()
    const upcomingEventsList: Event[] = []
    const pastEventsList: Event[] = []

    data.data.forEach((event: EventData) => {
      const eventDateTime = new Date(event.eventDate)

      const eventItem: Event = {
        id: event.id,
        type: 'event',
        title: event.title,
        coverImage: event.coverImage || '/assets/fallbackImg.jpeg',
        date: event.eventDate,
        time: event.eventTime || '',
        venue: event.venue || 'Venue TBA',
        mapUrl: event.mapUrl || '',
        description: event.description || '',
        bookingUrl: event.bookingUrl,
        slug: event.slug,
        city: event.city,
        gallery: event.gallery || [],
      }

      if (eventDateTime >= now) upcomingEventsList.push(eventItem)
      else pastEventsList.push(eventItem)
    })

    upcomingEventsList.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    pastEventsList.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )

    return {
      upcoming: upcomingEventsList,
      past: pastEventsList,
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return { upcoming: [], past: [] }
  }
})

export const revalidate = 3600

export default async function EventsPage() {
  const { upcoming, past } = await getEvents()

  return (
    <>
      <EventsClient upcomingEvents={upcoming} pastEvents={past} />
      <div
        className="pt-16"
        style={{
          backgroundImage: `
            linear-gradient(#47ABD8CC, #47ABD8CC),
            url('/MD-Texture_BG_Blue-01-04.png')
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <FooterWithBlogs />
      </div>
    </>
  )
}
