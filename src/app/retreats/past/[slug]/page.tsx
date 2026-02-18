import FooterWithBlogs from '@/components/FooterWithBlogs'
import PastRetreatClient from './PastRetreatClient'
import { notFound } from 'next/navigation'
import { getTestimonials } from '@/lib/data/testimonials'

async function getRetreat(slug: string) {
  const slugRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/retreats/by-slug/${slug}`,
    { cache: 'no-store' },
  )

  if (slugRes.ok) {
    const slugData = await slugRes.json()
    if (slugData.success && slugData.data) return slugData.data
  }

  const allRes = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/retreats`,
    { cache: 'no-store' },
  )

  const allData = await allRes.json()

  if (!allData.success) return null

  return allData.data.find((r: any) => r.id === slug) || null
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  console.log('Slug in Page:', slug)

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