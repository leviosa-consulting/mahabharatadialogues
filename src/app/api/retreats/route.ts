// app/api/retreats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";
import { generateFullSlug } from "@/utils/slugUtils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("retreats")
      .orderBy("created_at", "desc")
      .get();

    const retreats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: retreats });
  } catch (err) {
    console.error("Error fetching retreats:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch retreats" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { 
      title, 
      description, 
      venue,
      coverImage,
      bookingUrl,
      youtube_video, 
      photos, 
      footerNotes,
      day1, 
      day2,
      day3,
    } = body;

    if (!day1?.date || !day2?.date) {
      return NextResponse.json(
        { success: false, error: "Day 1 and Day 2 dates are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = generateFullSlug(title || "Mahabharata Dialogues");

    const newRetreat: any = {
      title: title || "Mahabharata Dialogues",
      slug,
      ...(description && { description }),
      ...(venue && { venue }),
      ...(coverImage && { coverImage }),
      ...(bookingUrl && { bookingUrl }),
      ...(youtube_video && { youtube_video }),
      ...(photos && photos.length > 0 && { photos }),
      ...(footerNotes && { footerNotes }),
      day1: {
        date: day1.date,
        dayName: day1.dayName || "",
        schedule: day1.schedule || []
      },
      day2: {
        date: day2.date,
        dayName: day2.dayName || "",
        schedule: day2.schedule || []
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add day3 if it exists
    if (day3 && day3.date) {
      newRetreat.day3 = {
        date: day3.date,
        dayName: day3.dayName || "",
        schedule: day3.schedule || []
      };
    }

    const docRef = await adminDB.collection("retreats").add(newRetreat);

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...newRetreat },
    });
  } catch (err) {
    console.error("Error creating retreat:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create retreat" },
      { status: 500 }
    );
  }
}

