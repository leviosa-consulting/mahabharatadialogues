import RetreatClient from './RetreatClient'
import { notFound } from 'next/navigation'
import FooterWithBlogs from '@/components/FooterWithBlogs'
import { cache } from 'react'
import { adminDB } from '@/firebase/firebaseAdmin'
import { Metadata } from 'next'

export const revalidate = 3600

const getRetreat = cache(async (slug: string) => {
  try {
    /* Read Firestore directly rather than fetching this app's own API over HTTP.
       The round-trip made rendering depend on NEXT_PUBLIC_SITE_URL pointing at a
       live port and on the API route compiling; when that route 500'd, the page
       fell through to a fallback matching r.id against a slug — which can never
       match, since they are unrelated values — and called notFound(). Same
       reasoning as UpcomingEventsServer. */
    const snapshot = await adminDB
      .collection('retreats')
      .where('slug', '==', slug)
      .limit(1)
      .get()

    if (snapshot.empty) return null

    const doc = snapshot.docs[0]

    /* JSON round-trip so the client component receives exactly the plain shapes
       the HTTP hop used to hand it, whatever field types Firestore returns. */
    return JSON.parse(JSON.stringify({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching retreat:', error)
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
        <FooterWithBlogs showBlogs={false} />
      </div>
    </>
  )
}