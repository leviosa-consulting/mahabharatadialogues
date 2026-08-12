import { adminDB } from "@/firebase/firebaseAdmin";
import { cache } from "react";

export const runtime = "nodejs";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  author: string;
  image_url: string;
  categories: string[];
  content: string;
  created_at: string;
  updated_at: string;
  gallery?: string[];
  gallery_columns?: number;
}

/** Convert a Firestore value to a plain JS value (strips Timestamps, DocumentRefs, etc.) */
function toPlain(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  // Firestore Timestamp (admin SDK)
  if (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).toDate === "function"
  ) {
    return (value as any).toDate().toISOString();
  }
  // DocumentReference or other Firestore objects — drop them
  if (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).path === "string" &&
    typeof (value as any).firestore === "object"
  ) {
    return null;
  }
  if (Array.isArray(value)) {
    return value.map(toPlain);
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        toPlain(v),
      ])
    );
  }
  return value;
}

export const getBlogs = cache(async (category?: string): Promise<Blog[]> => {
  try {
    let query = adminDB.collection("blogs").orderBy("created_at", "desc");

    if (category) {
      query = query.where("categories", "array-contains", category) as any;
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => {
      const raw = doc.data();
      return {
        id: doc.id,
        title: String(raw.title ?? ""),
        slug: String(raw.slug ?? ""),
        subtitle: String(raw.subtitle ?? ""),
        author: String(raw.author ?? ""),
        image_url: String(raw.image_url ?? ""),
        categories: Array.isArray(raw.categories)
          ? raw.categories.map(String)
          : [],
        content: String(raw.content ?? ""),
        created_at: toPlain(raw.created_at) as string ?? "",
        updated_at: toPlain(raw.updated_at) as string ?? "",
        gallery: Array.isArray(raw.gallery) ? raw.gallery.map(String) : undefined,
        gallery_columns: typeof raw.gallery_columns === "number" ? raw.gallery_columns : undefined,
      } satisfies Blog;
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
});
