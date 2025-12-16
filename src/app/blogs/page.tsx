
import { Metadata } from "next";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Blogs | Mahabharata Dialogues",
  description:
    "Read insightful blogs, research articles, teachings, and stories related to Mahabharata, spirituality, history, and Indian culture.",
};

async function fetchBlogs() {
  // ⭐ Works everywhere (Windows + Vercel + Localhost)
  const base =
    process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${base}/api/blogs`, {
    next: { revalidate: 60 },
  });

  const data = await res.json();
  return data.data || [];
}

export default async function BlogsPage() {
  const blogs = await fetchBlogs();
  return <BlogsClient initialBlogs={blogs} />;
}
