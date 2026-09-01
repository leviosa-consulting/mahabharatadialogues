import { cache } from 'react'
import UpcomingEventsClient from './UpcomingEventsClient'
import { adminDB } from '@/firebase/firebaseAdmin'
import { Event, parseDate } from '@/lib/events'

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

// Cache the API calls with revalidation
const getUpcomingItems = cache(async () => {
  const now = new Date()
  const thirtyDaysLater = new Date(now)
  thirtyDaysLater.setDate(now.getDate() + 300)

  try {
    /* Read Firestore directly instead of fetching this app's own /api routes over
       HTTP. The round-trip made rendering depend on NEXT_PUBLIC_SITE_URL matching a
       live port, and ECONNREFUSED was swallowed by the catch below — producing a
       200 page with no events and nothing in the browser console.

       The raw docs below never reach a client component: everything is mapped into
       explicit primitive Event objects further down, which is what keeps Firestore
       SDK objects out of the RSC payload. */
    const [retreatsSnapshot, eventsSnapshot] = await Promise.all([
      adminDB.collection('retreats').orderBy('created_at', 'desc').get(),
      adminDB.collection('events').orderBy('eventDate', 'desc').get(),
    ])

    const retreatsData = {
      success: true,
      data: retreatsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as RetreatData,
      ),
    }
    const eventsData = {
      success: true,
      data: eventsSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as EventData,
      ),
    }

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
      className="w-full relative"
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
    </div>
  )
}