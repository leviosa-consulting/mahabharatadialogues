// app/api/products/slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug missing" },
        { status: 400 }
      );
    }

    // Query Firestore for product with matching slug
    const snapshot = await adminDB
      .collection("products")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const productData = {
      id: doc.id,
      ...doc.data(),
    };

    return NextResponse.json({
      success: true,
      data: productData,
    });
  } catch (err) {
    console.error("Error fetching product by slug:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load product" },
      { status: 500 }
    );
  }
}