
// app/api/retreats/by-slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const snapshot = await adminDB
      .collection("retreats")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Retreat not found" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const retreat = {
      id: doc.id,
      ...doc.data(),
    };

    return NextResponse.json({ success: true, data: retreat });
  } catch (err) {
    console.error("Error fetching retreat by slug:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch retreat" },
      { status: 500 }
    );
  }
}