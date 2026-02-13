
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

const SETTINGS_DOC_ID = "blogs-page-settings";
const DEFAULT_SETTINGS = {
  title: "Blogs",
  subtitle: "Discover our upcoming events and relive the memories from past gatherings",
};

export async function GET() {
  try {
    const docRef = adminDB.collection("pageSettings").doc(SETTINGS_DOC_ID);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      // Create the document with default values if it doesn't exist
      const defaultData = {
        ...DEFAULT_SETTINGS,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      await docRef.set(defaultData);
      
      return NextResponse.json({
        success: true,
        data: DEFAULT_SETTINGS,
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

    // Use set with merge to create if doesn't exist
    await docRef.set(updateData, { merge: true });

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