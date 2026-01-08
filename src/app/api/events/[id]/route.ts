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

// Helper function to generate unique slug
async function generateUniqueSlug(baseSlug: string, excludeId: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    // Check if slug exists (excluding current document)
    const snapshot = await adminDB
      .collection("events")
      .where("slug", "==", slug)
      .get();
    
    // If no documents found, or only the current document, slug is unique
    if (snapshot.empty || (snapshot.docs.length === 1 && snapshot.docs[0].id === excludeId)) {
      return slug;
    }
    
    // Slug exists in another document, append counter and try again
    slug = `${baseSlug}-${counter}`;
    counter++;
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

    // Handle slug update - ensure uniqueness if slug changed
    let finalSlug = body.slug || existing?.slug || "";
    if (body.slug && body.slug !== existing?.slug) {
      finalSlug = await generateUniqueSlug(body.slug, id);
    }

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
      slug: finalSlug,
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