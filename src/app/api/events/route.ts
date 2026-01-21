// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";


async function generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    
    const snapshot = await adminDB
      .collection("events")
      .where("slug", "==", slug)
      .get();
    
   
    if (snapshot.empty || (excludeId && snapshot.docs.length === 1 && snapshot.docs[0].id === excludeId)) {
      return slug;
    }
    

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("events")
      .orderBy("eventDate", "desc")
      .get();

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: events });
  } catch (err) {
    console.error("Error fetching events:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, description, eventDate, venue, city, mapUrl,slug } = body;

    if (!title || !description || !eventDate || !venue || !city) {
      return NextResponse.json(
        { success: false, error: "Title, description, event date, venue and city are required" },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const uniqueSlug = await generateUniqueSlug(slug);

    const newEvent = {
      title,
      description,
      coverImage: body.coverImage || "",
      gallery: body.gallery || [],
      testimonial: body.testimonial || "",
      bookingUrl: body.bookingUrl || "",
      youtubeUrl: body.youtubeUrl || "",
      eventDate,
      slug: uniqueSlug,
      venue,
      city,
      mapUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await adminDB.collection("events").add(newEvent);

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...newEvent },
    });
  } catch (err) {
    console.error("Error creating event:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}