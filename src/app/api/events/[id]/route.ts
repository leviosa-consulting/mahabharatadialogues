// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";
import { deleteFromFirebaseStorageServer } from "@/utils/firebaseDeleteServer";

export const dynamic = "force-dynamic";

async function deleteFirebaseImage(url: string) {
  try {
    if (!url) return;
    await deleteFromFirebaseStorageServer(url);
  } catch (err) {
    console.error("Error deleting image:", err);
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Event ID missing" },
        { status: 400 }
      );
    }

    const docSnap = await adminDB.collection("events").doc(id).get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: docSnap.id, ...docSnap.data() },
    });
  } catch (err) {
    console.error("Error fetching event:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load event" },
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
        { success: false, error: "Event ID missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const docRef = adminDB.collection("events").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const existing = docSnap.data();

    // Validate required fields
    if (!body.venue) {
      return NextResponse.json(
        { success: false, error: "Venue is required" },
        { status: 400 }
      );
    }

    // Slug cannot be changed when editing (since it's used in URLs)
    // So we keep the existing slug
    const finalSlug = existing?.slug || body.slug;

    // Delete old cover image if it's being replaced
    if (body.coverImage && body.coverImage !== existing?.coverImage) {
      await deleteFirebaseImage(existing?.coverImage || "");
    }

    // Delete removed gallery images
    if (body.gallery && existing?.gallery) {
      const removedImages = (existing.gallery as string[]).filter(
        (img: string) => !body.gallery.includes(img)
      );
      for (const img of removedImages) {
        await deleteFirebaseImage(img);
      }
    }

    const updated = {
      ...existing,
      ...body,
      slug: finalSlug, // Keep original slug
      updated_at: new Date().toISOString(),
    };

    await docRef.update(updated);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating event:", err);
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
        { success: false, error: "Event ID missing" },
        { status: 400 }
      );
    }

    const docRef = adminDB.collection("events").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const data = docSnap.data();

    // Delete cover image
    if (data?.coverImage) {
      await deleteFirebaseImage(data.coverImage);
    }

    // Delete all gallery images
    if (data?.gallery && Array.isArray(data.gallery)) {
      for (const img of data.gallery) {
        await deleteFirebaseImage(img);
      }
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting event:", err);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}