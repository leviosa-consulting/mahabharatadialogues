import AboutClient from './AboutClient'
import FooterWithBlogs from '@/components/FooterWithBlogs'
<<<<<<< HEAD
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const revalidate = 43200

export const metadata: Metadata = {
  title: 'About Us | Mahabharata Dialogues',
  description:
    'Learn about Mahabharata Dialogues — a platform dedicated to sharing timeless wisdom, spiritual insights, and stories from the Mahabharata through events, retreats, and conversations.',

  alternates: {
    canonical: 'https://mahabharatadialogues.com/about',
  },
=======

async function getMembers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/about`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) return []

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching members:', error)
    return []
  }
>>>>>>> fc2a5da (Add error handling and timeouts to server-side data fetching)
}


const getMembers = cache(async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/about`, {
      next: { revalidate: 43200 },
    })

    const data = await res.json()

    const members = data.data || []

    members.sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )

    return members
  } catch {
    return []
  }
})

export default async function Page() {
  const members = await getMembers()

  return (
    <>
      <AboutClient members={members} />

      <div
        className="pt-20"
        style={{
          backgroundImage: `
    linear-gradient(#1D5C75, #1D5C75),
    url('/MD-Texture_BG_Blue-01-04.png')
  `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <FooterWithBlogs />
      </div>
    </>
  )
}
