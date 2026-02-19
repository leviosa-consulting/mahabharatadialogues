import { NextResponse } from "next/server"
import { adminDB } from "@/firebase/firebaseAdmin"

export async function GET(
  _: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug missing" },
        { status: 400 }
      )
    }

    // console.log("SLUG RECEIVED:", slug)

    const snapshot = await adminDB
      .collection("retreats")
      .where("slug", "==", slug)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return NextResponse.json(
        { success: false, error: "Retreat not found" },
        { status: 404 }
      )
    }

    const doc = snapshot.docs[0]

    return NextResponse.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data(),
      },
    })
  } catch (err) {
    console.error("Error fetching retreat:", err)

    return NextResponse.json(
      { success: false, error: "Failed to fetch retreat" },
      { status: 500 }
    )
  }
}
