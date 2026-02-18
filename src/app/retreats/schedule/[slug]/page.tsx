import RetreatClient from './RetreatClient'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import FooterWithBlogs from '@/components/FooterWithBlogs'

async function getBaseUrl() {
  const h = await headers()
  const host = h.get('host')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${host}`
}

async function getRetreat(slug: string) {
  const baseUrl = await getBaseUrl()

  // try slug first
  const slugRes = await fetch(`${baseUrl}/api/retreats/by-slug/${slug}`, {
    cache: 'no-store',
  })

  if (slugRes.ok) {
    const slugData = await slugRes.json()
    if (slugData.success && slugData.data) return slugData.data
  }

  // fallback by id
  const allRes = await fetch(`${baseUrl}/api/retreats`, {
    cache: 'no-store',
  })

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