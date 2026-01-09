// app/api/testimonials/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Testimonial ID missing" },
        { status: 400 }
      );
    }

    const docSnap = await adminDB.collection("testimonials").doc(id).get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: docSnap.id, ...docSnap.data() },
    });
  } catch (err) {
    console.error("Error fetching testimonial:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Testimonial ID missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const docRef = adminDB.collection("testimonials").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    const existing = docSnap.data();

    const updated = {
      ...existing,
      ...body,
      updated_at: new Date().toISOString(),
    };

    await docRef.update(updated);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating testimonial:", err);
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Testimonial ID missing" },
        { status: 400 }
      );
    }

    const docRef = adminDB.collection("testimonials").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}