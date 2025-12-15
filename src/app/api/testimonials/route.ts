// app/api/testimonials/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await adminDB
      .collection("testimonials")
      .orderBy("created_at", "desc")
      .get();

    const testimonials = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, data: testimonials });
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { quote, name, designation } = body;

    if (!quote || !name || !designation) {
      return NextResponse.json(
        { success: false, error: "Quote, name, and designation are required" },
        { status: 400 }
      );
    }

    const newTestimonial = {
      quote,
      name,
      designation,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await adminDB.collection("testimonials").add(newTestimonial);

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...newTestimonial },
    });
  } catch (err) {
    console.error("Error creating testimonial:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

