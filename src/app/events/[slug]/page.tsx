import { Suspense } from 'react'
import EventDetailWrapper from './EventDetailWrapper'
import FooterWithBlogs from '@/components/FooterWithBlogs'

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <>
      <Suspense>
        <EventDetailWrapper params={params} />
      </Suspense>
      <div style={{
        backgroundImage: `linear-gradient(#1D5C75CC, #1D5C75CC), url('/MD-Texture_BG_Blue-01-04.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '240px 240px',
      }} className="mt-12">
        <FooterWithBlogs />
      </div>
    </>
  )
}
