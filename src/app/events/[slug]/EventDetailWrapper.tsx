'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import EventDetailClient from './EventDetailClient.tsx'

export default function EventDetailWrapper({ params }: { params?: any }) {
  const routeParams = useParams()
  const slug = routeParams?.slug as string
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/events/slug/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setEvent(data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D5C75]"></div></div>
  if (!event) return <div className="min-h-screen flex items-center justify-center text-gray-500">Event not found</div>

  return <EventDetailClient event={event} />
}
