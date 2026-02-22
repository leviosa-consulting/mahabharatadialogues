import { cache } from 'react'
import UpcomingEventsClient from './UpcomingEventsClient'
import TestimonialsSection from './TestimonialsSection'

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
}

interface RetreatData {
  id: string
  title: string
  description: string
  photos?: string[]
  venue?: string
  city?: string
  mapUrl?: string
  day1: {
    date: string
    dayName: string
  }
  day2?: {
    date: string
    dayName: string
  }
  day3?: {
    date: string
    dayName: string
  }
  slug?: string
  bookingUrl: string
  coverImage: string
}

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
}

const parseDate = (dateStr: string): Date => {
  if (dateStr.includes('-')) {
    return new Date(dateStr)
  }

  const [day, month, year] = dateStr.split(' ')
  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  }
  return new Date(parseInt(year), monthMap[month], parseInt(day))
}

// Cache the API calls with revalidation
const getUpcomingItems = cache(async () => {
  const now = new Date()
  const thirtyDaysLater = new Date(now)
  thirtyDaysLater.setDate(now.getDate() + 300)

  try {
    const [retreatsResponse, eventsResponse] = await Promise.all([
<<<<<<< HEAD
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/retreats`),
=======
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/retreats`, {
        next: { revalidate: 43200 },
        signal: AbortSignal.timeout(8000),
      }),
>>>>>>> 137802a (Update project dependencies and improve data fetching reliability)
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/events`, {
        next: { revalidate: 43200 },
        signal: AbortSignal.timeout(8000),
      }),
    ])

    const retreatsData = await retreatsResponse.json()
    const eventsData = await eventsResponse.json()

    const allItems: Event[] = []

    // Process retreats
    if (retreatsData.success && retreatsData.data) {
      retreatsData.data.forEach((retreat: RetreatData) => {
        const retreatDate = parseDate(retreat.day1.date)
        retreatDate.setHours(23, 59, 59, 999)

        if (retreatDate >= now && retreatDate <= thirtyDaysLater) {
          const endDate =
            retreat.day3?.date || retreat.day2?.date || retreat.day1.date

          allItems.push({
            id: retreat.id,
            type: 'retreat',
            title: retreat.title,
            description: retreat.description || '',
            coverImage: retreat.coverImage || '/assets/fallbackImg.jpeg',
            date: retreat.day1.date,
            endDate: endDate,
            time: '',
            venue: retreat.venue || 'Venue TBA',
            mapUrl: retreat.mapUrl || '',
            city: retreat.city,
            slug: retreat.slug,
            bookingUrl: retreat.bookingUrl,
          })
        }
      })
    }

    // Process events
    if (eventsData.success && eventsData.data) {
      eventsData.data.forEach((event: EventData) => {
        const eventDateTime = new Date(event.eventDate)

        if (eventDateTime >= now && eventDateTime <= thirtyDaysLater) {
          allItems.push({
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
          })
        }
      })
    }

    // Sort by date (earliest first)
    allItems.sort((a, b) => {
      const dateA = a.type === 'event' ? new Date(a.date) : parseDate(a.date)
      const dateB = b.type === 'event' ? new Date(b.date) : parseDate(b.date)
      return dateA.getTime() - dateB.getTime()
    })

    return {
      featuredItem: allItems.length > 0 ? allItems[0] : null,
      upcomingItems: allItems.slice(1),
    }
  } catch (error) {
    console.error('Error fetching upcoming items:', error)
    return {
      featuredItem: null,
      upcomingItems: [],
    }
  }
})

export default async function UpcomingEventsServer() {
  const { featuredItem, upcomingItems } = await getUpcomingItems()

  return (
    <div
      className="w-full relative mb-30"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(29, 92, 117, 0.5),
            rgba(29, 92, 117, 0.5)
          ),
          url('/MD-Texture_BG_Blue-01-04.png')
        `,
        backgroundRepeat: "repeat",
        backgroundSize: "240px 240px",
      }}
    >
      <UpcomingEventsClient
        initialFeaturedItem={featuredItem}
        initialUpcomingItems={upcomingItems}
      />

      <TestimonialsSection textColor="#fff" />
    </div>
  )
}