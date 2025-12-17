// app/api/retreats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("retreats")
      .orderBy("retreatstartData", "desc")
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

    const { title, retreatstartData, retreatendData, coverImage } = body;

    if (!title || !retreatstartData || !retreatendData || !coverImage) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, start date, end date, and cover image are required",
        },
        { status: 400 }
      );
    }

    const newRetreat = {
      title,
      retreatstartData,
      retreatendData,
      description: body.description || "",
      coverImage,
      gallery: body.gallery || [],
      testimonial: body.testimonial || "",
      bookingUrl: body.bookingUrl || "",
      youtubeUrl: body.youtubeUrl || "",
      faqs: body.faqs || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

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

