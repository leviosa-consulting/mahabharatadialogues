'use client'

import { useState, useEffect } from 'react'
import { merri } from "@/app/fonts/merri";
import Link from "next/link";

type Blog = {
  id: string
  title: string
  slug: string
  image_url?: string
  updated_at?: string
}

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

export default function LatestBlog({
  count = 4,
}: {
  count?: number;
}) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setBlogs(data.data)
        } else if (Array.isArray(data)) {
          setBlogs(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const latestBlogs = blogs
    .filter((b) => b.updated_at)
    .sort(
      (a, b) =>
        new Date(b.updated_at!).getTime() -
        new Date(a.updated_at!).getTime()
    )
    .slice(0, count);

  if (loading) {
    return (
      <p className="text-white/70 mt-12 text-center md:text-left">
        Loading blogs...
      </p>
    );
  }

  if (latestBlogs.length === 0) {
    return (
      <p className="text-white/70 mt-12 text-center md:text-left">
        No blogs available yet.
      </p>
    );
  }

  return (
   <div className="flex flex-col w-full mt-12 gap-6">
  {latestBlogs.map((blog) => (
    <div
      key={blog.id}
      className="flex gap-4 items-start"
    >
      {/* Blog Image */}
      {blog.image_url && (
        <Link
          href={`/blogs/${blog.slug}`}
          className="shrink-0"
        >
          <img
            src={blog.image_url}
            alt={blog.title}
            className="
              w-[68px] h-[68px]
              md:w-[72px] md:h-[72px]
              object-cover
             
            "
          />
        </Link>
      )}

      {/* Date + Title */}
      <div className="flex flex-col text-left">
        <h2
          className={`${merri.className} font-bold text-[14px] md:text-[16px] text-white/80 leading-tight`}
        >
          {formatDate(blog.updated_at)}
        </h2>

        <Link
          href={`/blogs/${blog.slug}`}
          className="
            font-neco font-bold
            text-[18px] md:text-[20px]
            underline
            hover:opacity-80
            transition
            text-white
            leading-snug
          "
        >
          {blog.title.length > 60
            ? blog.title.slice(0, 60) + "..."
            : blog.title}
        </Link>
      </div>
    </div>
  ))}
</div>

  );
}
