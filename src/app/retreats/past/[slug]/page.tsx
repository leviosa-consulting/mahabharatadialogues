import { cache } from 'react'
import FooterWithBlogs from '@/components/FooterWithBlogs'
import PastRetreatClient from './PastRetreatClient'
import { notFound } from 'next/navigation'
import { getTestimonials } from '@/lib/data/testimonials'
import { Metadata } from 'next'

export const revalidate = 43200

const getRetreat = cache(async (slug: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'

    const slugRes = await fetch(
      `${baseUrl}/api/retreats/by-slug/${slug}`,
      {
        next: { revalidate: 43200 },
        signal: AbortSignal.timeout(8000),
      }
    )

    if (slugRes.ok) {
      const slugData = await slugRes.json()
      if (slugData.success && slugData.data) return slugData.data
    }

    const allRes = await fetch(`${baseUrl}/api/retreats`, {
      next: { revalidate: 43200 },
      signal: AbortSignal.timeout(8000),
    })

    if (!allRes.ok) return null

    const allData = await allRes.json()

    if (!allData.success) return null

    return allData.data.find((r: any) => r.id === slug) || null
  } catch {
    return null
  }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const retreat = await getRetreat(slug)

  if (!retreat) {
    return {
      title: 'Retreat Not Found',
      description: 'The requested retreat could not be found.',
    }
  }

  return {
    title: retreat.title,
    description: retreat.description,
    alternates: {
      canonical: `https://mahabharatadialogues.com/retreats/past/${retreat.slug}`,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const retreat = await getRetreat(slug)
  const testimonials = await getTestimonials()

  if (!retreat) notFound()

  return (
    <>
      <PastRetreatClient testimonials={testimonials} retreat={retreat} />

      <div className="bg-[#1D5C75CC] pt-12">
        <FooterWithBlogs />
      </div>
    </>
  )
}
