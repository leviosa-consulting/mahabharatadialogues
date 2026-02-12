// app/api/about/[id]/route.ts
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
        { success: false, error: "Member ID missing" },
        { status: 400 }
      );
    }

    const docSnap = await adminDB.collection("about").doc(id).get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: docSnap.id, ...docSnap.data() },
    });
  } catch (err) {
    console.error("Error fetching member:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load member" },
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
        { success: false, error: "Member ID missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const docRef = adminDB.collection("about").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    const existing = docSnap.data();

    // Validate required fields
    if (!body.name || !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: "Name and image are required" },
        { status: 400 }
      );
    }

    if (!body.roles || !Array.isArray(body.roles) || body.roles.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one role is required" },
        { status: 400 }
      );
    }

    if (!body.teamType || !['core', 'collaborators'].includes(body.teamType)) {
      return NextResponse.json(
        { success: false, error: "Valid team type is required (core or collaborators)" },
        { status: 400 }
      );
    }

    // Delete old image if it's being replaced
    if (body.imageUrl && body.imageUrl !== existing?.imageUrl) {
      await deleteFirebaseImage(existing?.imageUrl || "");
    }

    const updated = {
      ...existing,
      name: body.name,
      roles: body.roles,
      description: body.description || "",
      imageUrl: body.imageUrl,
      teamType: body.teamType,
      socialLinks: body.socialLinks || {},
      updated_at: new Date().toISOString(),
    };

    await docRef.update(updated);

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating member:", err);
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
        { success: false, error: "Member ID missing" },
        { status: 400 }
      );
    }

    const docRef = adminDB.collection("about").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    const data = docSnap.data();

    // Delete member image
    if (data?.imageUrl) {
      await deleteFirebaseImage(data.imageUrl);
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting member:", err);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}