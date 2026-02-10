import { Metadata } from "next"
import BlogDetailClient from "./BlogDetailClient"

interface Blog {
  id: string
  title: string
  subtitle: string
  image_url: string       
  og_image_url?: string   
  slug: string
  content: string
  author: string
  categories: string[]
  created_at: string
}

interface Props {
  params: {
    slug: string
  }
}

/* ---------------------------------------------------
   Fetch blog (NO internal API, NO no-store)
--------------------------------------------------- */

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${slug}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) return null

    const json = await res.json()
    return json.success ? json.data : null
  } catch (err) {
    console.error(err)
    return null
  }
}

/* ---------------------------------------------------
   Metadata
--------------------------------------------------- */

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const blog = await getBlog(params.slug)

  if (!blog) {
    return {
      title: "Blog not found",
      description: "Blog not found",
    }
  }

  const siteUrl = "https://mahabharatadialogues.com"
  const blogUrl = `${siteUrl}/blogs/${blog.slug}`

  const description =
    blog.subtitle ||
    blog.content.replace(/<[^>]*>/g, "").slice(0, 160)

  /* IMPORTANT:
     Use JPEG OG image
  */

  const ogImage =
    blog.og_image_url ||
    "https://mahabharatadialogues.com/og-default.jpg"

  return {
    title: blog.title,
    description,

    openGraph: {
      title: blog.title,
      description,
      url: blogUrl,
      siteName: "Mahabharata Dialogues",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [ogImage],
    },

    alternates: {
      canonical: blogUrl,
    },
  }
}

/* ---------------------------------------------------
   Page
--------------------------------------------------- */

export default async function BlogDetailPage({ params }: Props) {
  const blog = await getBlog(params.slug)

  return <BlogDetailClient initialBlog={blog} slug={params.slug} />
}
