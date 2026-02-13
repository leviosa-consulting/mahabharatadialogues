// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

async function generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const snapshot = await adminDB
      .collection("products")
      .where("slug", "==", slug)
      .get();
    
    if (snapshot.empty || (excludeId && snapshot.docs.length === 1 && snapshot.docs[0].id === excludeId)) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("products")
      .orderBy("name", "asc")
      .get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, author, price, category, description, slug } = body;

    if (!name || !author || !description || !category) {
      return NextResponse.json(
        { success: false, error: "Name, author, description, and category are required" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { success: false, error: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    // Validate category
    if (category !== 'Books' && category !== 'Games') {
      return NextResponse.json(
        { success: false, error: "Category must be either 'Books' or 'Games'" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const uniqueSlug = await generateUniqueSlug(slug);

    const newProduct = {
      name,
      author,
      price: Number(price),
      category,
      image: body.image || "",
      images: body.images || [],
      description,
      slug: uniqueSlug,
      productUrl: body.productUrl || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await adminDB.collection("products").add(newProduct);

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...newProduct },
    });
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}