import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";
import { revalidatePath } from 'next/cache'

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = adminDB.collection("blogs").orderBy("created_at", "desc");

    if (category) {
      query = query.where("categories", "array-contains", category) as any;
    }

    const snapshot = await query.get();
    
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
      gallery: body.gallery || [],
      gallery_columns: body.gallery_columns ?? 1,
      created_at: now,
      updated_at: now,
    };

    const docRef = await adminDB.collection("blogs").add(data);
    revalidatePath('/blogs')
    revalidatePath('/')

    return NextResponse.json(
      { success: true, message: "Blog created successfully", id: docRef.id, ...data },
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