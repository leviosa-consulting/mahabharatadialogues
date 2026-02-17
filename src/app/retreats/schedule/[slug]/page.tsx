import { Suspense } from 'react'
import ScheduleRetreatWrapper from './ScheduleRetreatWrapper'
import FooterWithBlogs from '@/components/FooterWithBlogs'

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <>
      <Suspense>
        <ScheduleRetreatWrapper />
      </Suspense>
      <div className="bg-[#1D5C75CC] pt-18">
        <FooterWithBlogs />
      </div>
    </>
  )
}
