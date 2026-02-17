import { Suspense } from 'react'
import PastRetreatWrapper from './PastRetreatWrapper'
import FooterWithBlogs from '@/components/FooterWithBlogs'

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <>
      <Suspense>
        <PastRetreatWrapper />
      </Suspense>
      <div className="bg-[#1D5C75CC] pt-12">
        <FooterWithBlogs />
      </div>
    </>
  )
}
