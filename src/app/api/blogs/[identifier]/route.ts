// app/api/blogs/[identifier]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";
import { deleteFromFirebaseStorageServer } from "@/utils/firebaseDeleteServer";

export const dynamic = "force-dynamic";

function isFirestoreId(str: string): boolean {
  return /^[A-Za-z0-9]{20}$/.test(str);
}

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
  context: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await context.params;
    // console.log("🟢 Identifier =", identifier);

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Identifier missing" },
        { status: 400 }
      );
    }

    if (isFirestoreId(identifier)) {
      const docSnap = await adminDB.collection("blogs").doc(identifier).get();

      if (!docSnap.exists) {
        return NextResponse.json(
          { success: false, error: "Not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { id: docSnap.id, ...docSnap.data() }
      });
    }

    const snap = await adminDB
      .collection("blogs")
      .where("slug", "==", identifier)
      .get();

    if (snap.empty) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    const doc = snap.docs[0];
    return NextResponse.json({
      success: true,
      data: { id: doc.id, ...doc.data() }
    });
  } catch (err) {
    console.error("🔥 FIRESTORE ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load blog" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await context.params;

    if (!isFirestoreId(identifier)) {
      return NextResponse.json(
        { success: false, error: "Update requires document ID, not slug" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const docRef = adminDB.collection("blogs").doc(identifier);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    const existing = docSnap.data();

    if (body.image_url && body.image_url !== existing?.image_url) {
      await deleteFirebaseImage(existing?.image_url || "");
    }

    const updated = {
      ...existing,
      ...body,
      updated_at: new Date().toISOString(),
    };

    await docRef.update(updated);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating blog:", err);
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await context.params;

    if (!isFirestoreId(identifier)) {
      return NextResponse.json(
        { success: false, error: "Delete requires document ID, not slug" },
        { status: 400 }
      );
    }

    const docRef = adminDB.collection("blogs").doc(identifier);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    const data = docSnap.data();

    if (data?.image_url) {
      await deleteFirebaseImage(data.image_url);
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting blog:", err);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}