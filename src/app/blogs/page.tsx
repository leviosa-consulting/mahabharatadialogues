import { Metadata } from "next";
import BlogsClient from "./BlogsClient";

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

async function fetchBlogs() {
  try {
    // Determine the base URL
    const base =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    console.log("Fetching blogs from:", `${base}/api/blogs`);

    const res = await fetch(`${base}/api/blogs`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if response is ok
    if (!res.ok) {
      console.error(`Failed to fetch blogs: ${res.status} ${res.statusText}`);
      return [];
    }

    // Check content type
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("API did not return JSON:", contentType);
      const text = await res.text();
      console.error("Response body:", text.substring(0, 200));
      return [];
    }

    const data = await res.json();
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error("Invalid response structure:", data);
      return [];
    }

    return data.data || data.blogs || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await fetchBlogs();
  return <BlogsClient initialBlogs={blogs} />;
}