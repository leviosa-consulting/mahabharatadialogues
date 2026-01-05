import { merri } from "@/app/fonts/merri";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  created_at?: string;
  updated_at: string;
}

/* ------------------ Utils ------------------ */

// Safe date formatter
const formatDate = (date?: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ------------------ Data ------------------ */

async function fetchBlogs(): Promise<Blog[]> {
  let baseUrl = "";

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  } else if (process.env.VERCEL_URL) {
    baseUrl = `https://${process.env.VERCEL_URL}`;
  } else if (process.env.NODE_ENV === "development") {
    baseUrl = "http://localhost:3000";
  } else {
    baseUrl = "https://mahabharatadialogues.com";
  }

  try {
    const res = await fetch(`${baseUrl}/api/blogs`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || data.blogs || [];
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return [];
  }
}

/* ------------------ Component ------------------ */

export default async function LatestBlogs() {
  const blogs = await fetchBlogs();

  const latestBlogs = blogs
    .filter((b) => b.updated_at)
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, 4);

  if (latestBlogs.length === 0) {
    return (
      <p className="text-white/70 mt-12 text-center md:text-left">
        No blogs available yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col w-full mt-12 gap-10">
      {latestBlogs.map((blog) => (
        <div
          key={blog.id}
          className="
            text-white
            w-full
            flex flex-col 
            text-center
            md:text-left
            md:max-w-[300px]
            mx-auto md:mx-0
          "
        >
          {/* DATE */}
          <h2
            className={`${merri.className} font-bold text-[14px] md:text-[18px]`}
          >
            {formatDate(blog.updated_at)}
          </h2>

          {/* TITLE */}
          <Link
            href={`/blogs/${blog.slug}`}
            className="
              font-neco font-bold
              text-[16px] md:text-[18px]
              underline
              hover:opacity-80
              transition
              inline-block
            "
          >
            {blog.title.length > 48
              ? blog.title.slice(0, 48) + "..."
              : blog.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
