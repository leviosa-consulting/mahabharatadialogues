'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import RetreatClient from './RetreatClient'

export default function ScheduleRetreatWrapper() {
  const params = useParams()
  const slug = params?.slug as string
  const [retreat, setRetreat] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        let retreatData = null

        const slugRes = await fetch(`/api/retreats/by-slug/${slug}`)
        if (slugRes.ok) {
          const slugData = await slugRes.json()
          if (slugData.success && slugData.data) {
            retreatData = slugData.data
          }
        }

        if (!retreatData) {
          const allRes = await fetch('/api/retreats')
          const allData = await allRes.json()
          if (allData.success) {
            retreatData = allData.data.find((r: any) => r.id === slug) || null
          }
        }

        setRetreat(retreatData)
      } catch {}

      setLoading(false)
    }

    fetchData()
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D5C75]"></div></div>
  if (!retreat) return <div className="min-h-screen flex items-center justify-center text-gray-500">Retreat not found</div>

  return <RetreatClient retreat={retreat} />
}
