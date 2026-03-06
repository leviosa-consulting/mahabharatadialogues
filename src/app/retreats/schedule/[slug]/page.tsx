import RetreatClient from './RetreatClient'
import { notFound } from 'next/navigation'
import FooterWithBlogs from '@/components/FooterWithBlogs'
import { cache } from 'react'
import { Metadata } from 'next'

export const revalidate = 3600

const getRetreat = cache(async (slug: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const slugRes = await fetch(
      `${baseUrl}/api/retreats/by-slug/${slug}`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (slugRes.ok) {
      const slugData = await slugRes.json()
      if (slugData.success && slugData.data) return slugData.data
    }

    const allRes = await fetch(`${baseUrl}/api/retreats`, {
      next: { revalidate: 3600 },
    })

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
      title: 'Retreat Schedule Not Found',
      description: 'The requested retreat schedule could not be found.',
      
    }
  }

  return {
    title: `${retreat.title} | Schedule`,
    description: retreat.description,
      alternates: {
    canonical: `https://mahabharatadialogues.com/retreats/schedule/${retreat.slug}`,
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

  if (!retreat) notFound()

  return (
    <>
      <RetreatClient retreat={retreat} />

      <div className="bg-[#1D5C75CC] pt-18">
        <FooterWithBlogs />
      </div>
    </>
  )
}