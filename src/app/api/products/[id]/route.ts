// app/api/products/[id]/route.ts
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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID missing" },
        { status: 400 }
      );
    }

    const doc = await adminDB.collection("products").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
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
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID missing" },
        { status: 400 }
      );
    }

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

    // Generate unique slug (excluding current product)
    const uniqueSlug = await generateUniqueSlug(slug, id);

    const updatedProduct = {
      name,
      author,
      price: Number(price),
      category,
      image: body.image || "",
      images: body.images || [],
      description,
      slug: uniqueSlug,
      updated_at: new Date().toISOString(),
    };

    await adminDB.collection("products").doc(id).update(updatedProduct);

    return NextResponse.json({
      success: true,
      data: { id, ...updatedProduct },
    });
  } catch (err) {
    console.error("Error updating product:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
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
        { success: false, error: "Product ID missing" },
        { status: 400 }
      );
    }

    await adminDB.collection("products").doc(id).delete();

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}