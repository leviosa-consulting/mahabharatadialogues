import { Metadata } from "next";
import BlogsClient from "./BlogsClient";
import { getBlogs } from "@/lib/data/blogs";

export const metadata: Metadata = {
  title: "Blogs | Mahabharata Dialogues",
  description:
    "Read insightful blogs, research articles, teachings, and stories related to Mahabharata, spirituality, history, and Indian culture.",
  keywords: "Mahabharata blogs, Indian mythology, spirituality, wisdom, philosophy",
  openGraph: {
    title: "Blogs | Mahabharata Dialogues",
    description: "Read insightful blogs, research articles, teachings, and stories related to Mahabharata, spirituality, history, and Indian culture.",
    type: "website",
    url: "https://mahabharatadialogues.com/blogs",
    siteName: "Mahabharata Dialogues",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs | Mahabharata Dialogues",
    description: "Read insightful blogs, research articles, teachings, and stories related to Mahabharata, spirituality, history, and Indian culture.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function BlogsPage() {
  const blogs = await getBlogs();
  
  return <BlogsClient initialBlogs={blogs} />;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
