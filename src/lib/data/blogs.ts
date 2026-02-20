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
}

export const getBlogs = cache(async (category?: string): Promise<Blog[]> => {
  try {
    let query = adminDB.collection("blogs").orderBy("created_at", "desc");

    if (category) {
      query = query.where("categories", "array-contains", category) as any;
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Blog[];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
});
