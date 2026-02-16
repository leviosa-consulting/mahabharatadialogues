// app/events/[slug]/page.tsx

import EventDetailClient from "./EventDetailClient.tsx"

interface Event {
  id: string
  title: string
  description: string
  coverImage: string
  gallery?: string[]
  testimonial?: string
  bookingUrl?: string
  youtubeUrl?: string
  mapUrl?: string
  eventDate: string
  slug: string
  venue: string
  city?: string
}

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/events/slug/${slug}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (data.success) return data.data;

    return null;
  } catch {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await getEvent(slug);

  if (!event) return null;

  return <EventDetailClient event={event} />;
}