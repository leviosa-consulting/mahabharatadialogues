import { cache } from 'react'

export interface Testimonial {
  id: string
  quote: string
  name: string
  designation: string
}

const FALLBACK: Testimonial[] = [
  {
    id: '1',
    quote: 'Quotes on how amazing it is to be in any of the workshop...',
    name: 'Hansini',
    designation: 'President of Rotary Club, Bengaluru',
  },
]

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/testimonials`,
      {
        next: { revalidate: 43200
 }, 
      }
    )

    const data = await res.json()

    if (data.success && data.data?.length) {
      return data.data
    }

    return FALLBACK
  } catch {
    return FALLBACK
  }
})
