import { cache } from 'react'
import AboutClient from './AboutClient'
import FooterWithBlogs from '@/components/FooterWithBlogs'
import { Metadata } from 'next'
<<<<<<< HEAD
=======
import { cache } from 'react'

export const revalidate = 43200
>>>>>>> 137802a (Update project dependencies and improve data fetching reliability)

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Mahabharata Dialogues, our mission, vision, and the team dedicated to spreading timeless wisdom and spiritual growth.',
      alternates: {
    canonical: `https://mahabharatadialogues.com/about`,
  },
}

const getMembers = cache(async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/about`, {
<<<<<<< HEAD
      next: { revalidate: 3600 },
=======
      next: { revalidate: 43200 },
      signal: AbortSignal.timeout(8000),
>>>>>>> 137802a (Update project dependencies and improve data fetching reliability)
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