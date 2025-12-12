// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

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

    const { title, description, eventDate } = body;

    if (!title || !description || !eventDate) {
      return NextResponse.json(
        { success: false, error: "Title, description, and event date are required" },
        { status: 400 }
      );
    }

    const newEvent = {
      title,
      description,
      coverImage: body.coverImage || "",
      gallery: body.gallery || [],
      testimonial: body.testimonial || "",
      bookingUrl: body.bookingUrl || "",
      youtubeUrl: body.youtubeUrl || "",
      eventDate,
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