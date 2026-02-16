import TestimonialsCarousel from "./TestimonialsCarousel";

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  designation: string;
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/testimonials`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (data.success && data.data.length > 0) {
      return data.data;
    }

    return [
      {
        id: "1",
        quote:
          "Quotes on how amazing it is to be in any of the workshop...",
        name: "Hansini",
        designation: "President of Rotary Club, Bengaluru",
      },
    ];
  } catch (error) {
    return [
      {
        id: "1",
        quote:
          "Quotes on how amazing it is to be in any of the workshop...",
        name: "Hansini",
        designation: "President of Rotary Club, Bengaluru",
      },
    ];
  }
}

export default async function TestimonialsSection({
  textColor,
}: {
  textColor?: string;
}) {
  const testimonials = await getTestimonials();

  return (
    <TestimonialsCarousel
      testimonials={testimonials}
      textColor={textColor}
    />
  );
}