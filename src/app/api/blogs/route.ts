// app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

// GET — fetch all blogs
export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("blogs")
      .orderBy("created_at", "desc")
      .get();
    
    const blogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST — create new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, slug, content, author } = body;

    if (!title || !slug || !content || !author) {
      return NextResponse.json(
        { success: false, error: "Title, slug, author & content are required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const slugCheck = await adminDB
      .collection("blogs")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (!slugCheck.empty) {
      return NextResponse.json(
        { success: false, error: "Slug already exists" },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const data = {
      title,
      subtitle: body.subtitle || "",
      image_url: body.image_url || "",
      slug,
      author,
      categories: body.categories || [],
      content,
      created_at: now,
      updated_at: now,
    };

    const docRef = await adminDB.collection("blogs").add(data);

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        id: docRef.id,
        ...data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}