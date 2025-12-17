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
   
    let baseUrl = "";
    
   
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    }
   
    else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    
    else if (process.env.NODE_ENV === "development") {
      baseUrl = "http://localhost:3000";
    }
    
    else {
      baseUrl = "https://mahabharatadialogues.com";
    }

    console.log("🔍 Fetching blogs from:", `${baseUrl}/api/blogs`);
    console.log("Environment:", process.env.NODE_ENV);

    const res = await fetch(`${baseUrl}/api/blogs`, {
      cache: 'no-store', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("📡 Response status:", res.status);

    if (!res.ok) {
      console.error(`❌ Failed to fetch blogs: ${res.status} ${res.statusText}`);
      return [];
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ API did not return JSON:", contentType);
      const text = await res.text();
      console.error("Response preview:", text.substring(0, 300));
      return [];
    }

    const data = await res.json();
    // console.log("✅ Blogs fetched successfully:", data?.data?.length || 0);
    
    return data.data || data.blogs || [];
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await fetchBlogs();
  
  console.log("📊 Rendering BlogsPage with", blogs.length, "blogs");
  
  return <BlogsClient initialBlogs={blogs} />;
}


export const dynamic = 'force-dynamic';
export const revalidate = 60; 