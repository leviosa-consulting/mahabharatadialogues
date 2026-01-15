
// app/api/retreats/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";
import { generateFullSlug } from "@/utils/slugUtils";

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
      coverImage,
      youtube_video, 
      photos, 
      price,
      inclusions,
      footerNotes,
      bookingUrl,
      day1, 
      day2,
      day3,
    } = body;

    if (!day1?.date || !day2?.date) {
      return NextResponse.json(
        { success: false, error: "Day 1 and Day 2 dates are required" },
        { status: 400 }
      );
    }

    // Get existing retreat to check if title changed
    const existingDoc = await adminDB.collection("retreats").doc(id).get();
    const existingData = existingDoc.data();
    
    // Generate new slug if title changed or if slug doesn't exist
    let slug = existingData?.slug;
    if (!slug || existingData?.title !== title) {
      slug = generateFullSlug(title || "Mahabharata Dialogues");
    }

    const updateData: any = {
      title: title || "Mahabharata Dialogues",
      slug,
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
    if(price) updateData.price = price;
    if(inclusions) updateData.inclusions = inclusions;
    if (coverImage) updateData.coverImage = coverImage;
    if (youtube_video) updateData.youtube_video = youtube_video;
    if (photos && photos.length > 0) updateData.photos = photos;
    if (footerNotes) updateData.footerNotes = footerNotes;
    if (bookingUrl) updateData.bookingUrl = bookingUrl;

    // Add or remove day3
    if (day3 && day3.date) {
      updateData.day3 = {
        date: day3.date,
        dayName: day3.dayName || "",
        schedule: day3.schedule || []
      };
    } else {
      // Explicitly remove day3 if it's not provided
      updateData.day3 = null;
    }

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

