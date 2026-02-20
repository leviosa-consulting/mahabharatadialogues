
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const SETTINGS_DOC_ID = "events-page-settings";

export async function GET() {
  try {
    const docSnap = await adminDB
      .collection("pageSettings")
      .doc(SETTINGS_DOC_ID)
      .get();

    if (!docSnap.exists) {
      // Return default values if settings don't exist
      return NextResponse.json({
        success: true,
        data: {
          title: "Events",
          subtitle: "Discover our upcoming events and relive the memories from past gatherings",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: docSnap.data(),
    });
  } catch (err) {
    console.error("Error fetching page settings:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subtitle } = body;

    if (!title || !subtitle) {
      return NextResponse.json(
        { success: false, error: "Title and subtitle are required" },
        { status: 400 }
      );
    }

    const docRef = adminDB.collection("pageSettings").doc(SETTINGS_DOC_ID);
    
    const updateData = {
      title,
      subtitle,
      updated_at: new Date().toISOString(),
    };

    await docRef.set(updateData, { merge: true });
   revalidatePath("/events");
   revalidatePath("/");
    return NextResponse.json({
      success: true,
      data: updateData,
    });
  } catch (err) {
    console.error("Error updating page settings:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update page settings" },
      { status: 500 }
    );
  }
}