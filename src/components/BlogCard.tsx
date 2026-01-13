import { merri } from '@/app/fonts/merri'
import Link from 'next/link'

type Blog = {
  id: string
  title: string
  subtitle: string
  image_url: string
  slug: string
  author: string
  created_at: string
}

export default function BlogCard({
  blog
}: {
  blog: Blog
}) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return 'Unknown date'
    }
  }

  return (
    <div className="flex gap-4 flex-col md:flex-row md:items-center">
      {/* IMAGE */}
     <Link
  href={`/blogs/${blog.slug}`}
  className="
    w-full
    aspect-[284/186]
    overflow-hidden
    md:w-[264px]
    lg:w-[284px]
  "
>
  <img
    src={blog.image_url}
    alt={blog.title}
    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
  />
</Link>


      {/* TEXT */}
      <div className="text-white text-center md:text-left md:max-w-[300px]">
        <h2 className={`${merri.className} font-bold text-[14px] md:text-[16px]`}>
          {formatDate(blog.created_at)}
        </h2>

        <Link
          href={`/blogs/${blog.slug}`}
          className="
            font-neco font-bold
            text-[16px] md:text-[20px]
            underline
            hover:text-gray-300
            transition
            block mt-2
          "
        >
          {blog.title}
        </Link>
      </div>
    </div>
  )
}