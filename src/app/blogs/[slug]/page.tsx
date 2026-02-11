import { Metadata } from 'next'
import BlogDetailClient from './BlogDetailClient'

interface Blog {
  id: string
  title: string
  subtitle: string
  image_url: string
  slug: string
  content: string
  author: string
  categories: string[]
  created_at: string
}

interface Props {
  params: Promise<{
    slug: string
  }>
}

async function getBlogData(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/blogs/${slug}`
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogData(slug)

  if (!blog) {
    return {
      title: 'Blog Not Found | Mahabharata Dialogues',
      description: 'The requested blog post could not be found.',
    }
  }

  const contentText = blog.content.replace(/<[^>]*>/g, '').trim()
  const description = blog.subtitle || contentText.substring(0, 160) + '...'
  
  const blogUrl = `https://mahabharatadialogues.com/blogs/${blog.slug}`
  
  const imageUrl = blog.image_url.startsWith('http') 
    ? blog.image_url 
    : `https://mahabharatadialogues.com${blog.image_url}`

  return {
    title: `${blog.title} | Mahabharata Dialogues`,
    description: description,
    
    openGraph: {
      title: blog.title,
      description: description,
      url: blogUrl,
      siteName: 'Mahabharata Dialogues',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: blog.created_at,
      authors: [blog.author],
    },

    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: description,
      images: [imageUrl],
    },

    alternates: {
      canonical: blogUrl,
    },


    other: {
      'og:image': imageUrl,
      'og:image:secure_url': imageUrl,
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': blog.title,
      'twitter:image': imageUrl,
      'twitter:card': 'summary_large_image',
    },
  }
}

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/blogs`, {
      next: { revalidate: 3600 }
    })
    const data = await response.json()
 
    if (!data.success) {
      return []
    }

    return data.data.map((blog: Blog) => ({
      slug: blog.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlogData(slug)

  const imageUrl = blog?.image_url?.startsWith('http') 
    ? blog.image_url 
    : `https://mahabharatadialogues.com${blog?.image_url || ''}`

  const structuredData = blog ? {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `https://mahabharatadialogues.com/blogs/${blog.slug}#article`,
        headline: blog.title,
        description: blog.subtitle || blog.content.replace(/<[^>]*>/g, '').trim().substring(0, 160),
        image: {
          '@type': 'ImageObject',
          url: imageUrl,
          width: 1200,
          height: 630,
          caption: blog.title,
        },
        author: {
          '@type': 'Person',
          name: blog.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Mahabharata Dialogues',
          logo: {
            '@type': 'ImageObject',
            url: 'https://mahabharatadialogues.com/logo.png',
          },
        },
        datePublished: blog.created_at,
        dateModified: blog.created_at,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://mahabharatadialogues.com/blogs/${blog.slug}`,
        },
      },
    ],
  } : null

  return (
    <>
      
      {blog && (
        <>
          <meta property="og:title" content={blog.title} />
          <meta property="og:description" content={blog.subtitle.substring(0, 60) || blog.content.replace(/<[^>]*>/g, '').substring(0, 160)} />
          <meta property="og:image" content={imageUrl} />
          <meta property="og:image:secure_url" content={imageUrl} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={blog.title} />
          <meta property="og:url" content={`https://mahabharatadialogues.com/blogs/${blog.slug}`} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={blog.title} />
          <meta name="twitter:description" content={blog.subtitle || blog.content.replace(/<[^>]*>/g, '').substring(0, 160)} />
          <meta name="twitter:image" content={imageUrl} />
        </>
      )}
      
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      <BlogDetailClient initialBlog={blog} slug={slug} />
    </>
  )
}