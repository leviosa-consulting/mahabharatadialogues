import { adminDB } from "@/firebase/firebaseAdmin";

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

export async function getBlogs(category?: string): Promise<Blog[]> {
  try {
    let query = adminDB.collection("blogs").orderBy("created_at", "desc");

    if (category) {
      query = query.where("categories", "array-contains", category) as any;
    }

    const snapshot = await query.get();

    const blogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Blog[];

    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}