
import EventsClient from '@/components/EventsClient'

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

async function getEvents() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/events`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }
    
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

      if (eventDateTime >= now) {
        upcomingEventsList.push(eventItem)
      } else {
        pastEventsList.push(eventItem)
      }
    })

    upcomingEventsList.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    pastEventsList.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB.getTime() - dateA.getTime()
    })

    return {
      upcoming: upcomingEventsList,
      past: pastEventsList,
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return { upcoming: [], past: [] }
  }
}

export default async function EventsPage() {
  const { upcoming, past } = await getEvents()

  return <EventsClient upcomingEvents={upcoming} pastEvents={past} />
}