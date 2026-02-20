import FooterWithBlogs from '@/components/FooterWithBlogs'
import PastRetreatClient from './PastRetreatClient'
import { notFound } from 'next/navigation'
import { getTestimonials } from '@/lib/data/testimonials'
import { cache } from 'react'

export const revalidate = 43200


const getRetreat = cache(async (slug: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const slugRes = await fetch(
      `${baseUrl}/api/retreats/by-slug/${slug}`,
      {
        next: { revalidate: 43200
 },
      }
    )

    if (slugRes.ok) {
      const slugData = await slugRes.json()
      if (slugData.success && slugData.data) return slugData.data
    }

    const allRes = await fetch(`${baseUrl}/api/retreats`, {
      next: { revalidate: 43200
 },
    })

    const allData = await allRes.json()

    if (!allData.success) return null

    return allData.data.find((r: any) => r.id === slug) || null
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
