// app/api/about/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await adminDB.collection("about").get();

    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: members });
  } catch (err) {
    console.error("Error fetching members:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load members" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    const newMember = {
      name: body.name,
      roles: body.roles,
      description: body.description || "",
      imageUrl: body.imageUrl,
      teamType: body.teamType,
      socialLinks: body.socialLinks || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await adminDB.collection("about").add(newMember);

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...newMember },
    });
  } catch (err) {
    console.error("Error creating member:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create member" },
      { status: 500 }
    );
  }
}