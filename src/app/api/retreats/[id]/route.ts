

// app/api/retreats/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { 
      title, 
      description, 
      venue, 
      youtube_video, 
      photos, 
      day1, 
      day2, 
    } = body;

    if (!day1?.date || !day2?.date) {
      return NextResponse.json(
        { success: false, error: "Both day dates are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      title: title || "Mahabharata Dialogues",
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
      updated_at: new Date().toISOString(),
    };

    // Only add optional fields if they have values
    if (description) updateData.description = description;
    if (venue) updateData.venue = venue;
    if (youtube_video) updateData.youtube_video = youtube_video;
    if (photos && photos.length > 0) updateData.photos = photos;

    await adminDB
      .collection("retreats")
      .doc(id)
      .update(updateData);

    return NextResponse.json({
      success: true,
      data: { id, ...updateData },
    });
  } catch (err) {
    console.error("Error updating retreat:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update retreat" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await adminDB.collection("retreats").doc(id).delete();

    return NextResponse.json({
      success: true,
      message: "Retreat deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting retreat:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete retreat" },
      { status: 500 }
    );
  }
}