import { cache } from 'react'
import { adminDB } from '@/firebase/firebaseAdmin'

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

/* Reads Firestore directly rather than fetching this app's own /api/testimonials.
   The HTTP hop made rendering depend on NEXT_PUBLIC_SITE_URL pointing at a live
   port, and its failure was swallowed into FALLBACK with nothing logged.

   The explicit field pick is required, not stylistic: doc.data() returns Firestore
   SDK objects, and spreading them into props sent to a client component serializes
   the whole SDK class tree into the RSC payload. See .agents/memory/rsc-firestore-fix.md */
export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const snapshot = await adminDB
      .collection('testimonials')
      .orderBy('created_at', 'desc')
      .get()

    const testimonials: Testimonial[] = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        quote: String(data.quote ?? ''),
        name: String(data.name ?? ''),
        designation: String(data.designation ?? ''),
      }
    })

    return testimonials.length ? testimonials : FALLBACK
  } catch (error) {
    console.error('getTestimonials: Firestore read failed', error)
    return FALLBACK
  }
})
