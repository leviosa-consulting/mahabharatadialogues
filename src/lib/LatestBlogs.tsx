import { merri } from '@/app/fonts/merri'
import Link from 'next/link'

type Blog = {
  id: string
  title: string
  slug: string
  image_url?: string
  updated_at?: string
}

const formatDate = (date?: string) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function LatestBlogs({
  blogs,
  count = 2,
}: {
  blogs: Blog[]
  count?: number
}) {
  const latestBlogs = blogs
    .filter(b => b.updated_at)
    .sort(
      (a, b) =>
        new Date(b.updated_at!).getTime() -
        new Date(a.updated_at!).getTime()
    )
    .slice(0, count)

  if (!latestBlogs.length) {
    return (
      <p className="text-white/70 mt-6 text-center md:text-left">
        No blogs available yet.
      </p>
    )
  }

  return (
    <div className="flex flex-col w-full mt-6 gap-6">
      {latestBlogs.map(blog => (
        <div key={blog.id} className="flex gap-4 items-start">
          {blog.image_url && (
            <Link href={`/blogs/${blog.slug}`} className="shrink-0">
              <img
                src={blog.image_url}
                alt={blog.title}
                className="w-[68px] h-[68px] md:w-[72px] md:h-[72px] object-cover"
              />
            </Link>
          )}

          <div className="flex flex-col text-left">
            <h2 className={`${merri.className} font-bold text-[14px] md:text-[16px] text-white/80`}>
              {formatDate(blog.updated_at)}
            </h2>

            <Link
              href={`/blogs/${blog.slug}`}
              className="font-neco font-bold underline text-white hover:opacity-80"
            >
              {blog.title.length > 60
                ? blog.title.slice(0, 60) + '...'
                : blog.title}
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}