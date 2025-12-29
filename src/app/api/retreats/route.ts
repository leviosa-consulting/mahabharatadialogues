// app/api/retreats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

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

    const { title, subtitle, day1, day2, footerNote } = body;

    if (!day1?.date || !day2?.date) {
      return NextResponse.json(
        { success: false, error: "Both day dates are required" },
        { status: 400 }
      );
    }

    const newRetreat = {
      title: title || "Mahabharata Dialogues",
      subtitle: subtitle || "",
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
      footerNote: footerNote || "",
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