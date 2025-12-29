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
        { success: false, error: "Retreat ID missing" },
        { status: 400 }
      );
    }

    const docSnap = await adminDB.collection("retreats").doc(id).get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Retreat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: docSnap.id, ...docSnap.data() },
    });
  } catch (err) {
    console.error("Error fetching retreat:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load retreat" },
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
        { success: false, error: "Retreat ID missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const docRef = adminDB.collection("retreats").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Retreat not found" },
        { status: 404 }
      );
    }

    const existing = docSnap.data();

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
      updated_at: new Date().toISOString(),
    };

    await docRef.update(updated);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating retreat:", err);
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
        { success: false, error: "Retreat ID missing" },
        { status: 400 }
      );
    }

    const docRef = adminDB.collection("retreats").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Retreat not found" },
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
      message: "Retreat deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting retreat:", err);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}