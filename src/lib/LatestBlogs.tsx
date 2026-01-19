import { merri } from "@/app/fonts/merri";
import Link from "next/link";
import { getBlogs } from "@/lib/data/blogs";

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

export default async function LatestBlogs({
  count = 4,
}: {
  count?: number;
}) {
  const blogs = await getBlogs();

  const latestBlogs = blogs
    .filter((b) => b.updated_at)
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, count);

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
          <h2 className={`${merri.className} font-bold text-[14px] md:text-[16px]`}>
            {formatDate(blog.updated_at)}
          </h2>

          <Link
            href={`/blogs/${blog.slug}`}
            className="
              font-neco font-bold
              text-[16px] md:text-[20px]
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
