import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  slug: string;
  created_at?: string;
  updated_at: string; // ISO string e.g. "2025-12-15T11:08:59.261Z"
}

// Safe date formatter (handles undefined / invalid)
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
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || data.blogs || [];
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return [];
  }
}

export default async function LatestBlogs() {
  const blogs = await fetchBlogs();

  const latestBlogs = blogs
    .filter((b) => b.updated_at) // ensure exists
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, 3);

  if (latestBlogs.length === 0) {
    return (
      <p className="text-white/70 mt-12">
        No blogs available yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col w-full mt-12 gap-12">
      {latestBlogs.map((blog) => (
        <div
          key={blog.id}
          className="text-white max-w-[300px] flex flex-col gap-2"
        >
          <h2 className="font-merri font-bold text-[18px]">
            {formatDate(blog.updated_at)}
          </h2>

          <Link
            href={`/blogs/${blog.slug}`}
            className="font-neco font-bold text-[18px] underline hover:opacity-80 transition"
          >
            {blog.title.length > 40
              ? blog.title.slice(0, 40) + "..."
              : blog.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
