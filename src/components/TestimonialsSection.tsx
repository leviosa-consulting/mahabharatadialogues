import TestimonialsCarousel from './TestimonialsCarousel'
import { getTestimonials } from '@/lib/data/testimonials'

export const revalidate = 43200


export default async function TestimonialsSection({
  textColor,
}: {
  textColor?: string
}) {
  const testimonials = await getTestimonials()

  return (
    <TestimonialsCarousel
      testimonials={testimonials}
      textColor={textColor}
    />
  )
}
