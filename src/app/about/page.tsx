import AboutClient from './AboutClient'
import FooterWithBlogs from '@/components/FooterWithBlogs'
import { notFound } from 'next/navigation'

async function getMembers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/about`, {
    cache: 'no-store',
  })

  const data = await res.json()
  return data.data || []
}

export default async function Page() {
  const members = await getMembers()

  if (!members) notFound()

  return (
    <>
      <AboutClient members={members} />
      <div className='pt-20'
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
