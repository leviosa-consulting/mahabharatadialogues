// app/api/events/slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Event slug missing" },
        { status: 400 }
      );
    }

    // Query Firestore for event with matching slug
    const snapshot = await adminDB
      .collection("events")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const eventData = {
      id: doc.id,
      ...doc.data(),
    };

    return NextResponse.json({
      success: true,
      data: eventData,
    });
  } catch (err) {
    console.error("Error fetching event by slug:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load event" },
      { status: 500 }
    );
  }
}