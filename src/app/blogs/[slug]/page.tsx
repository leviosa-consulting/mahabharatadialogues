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
    
    console.log('Fetching blog from:', url)
    
    const response = await fetch(url, {
      cache: 'no-store', 
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      console.error('Failed to fetch blog, status:', response.status)
      return null
    }

    const data = await response.json()
    console.log('Blog data received:', data.success ? 'Success' : 'Failed')
    
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
  
  const wordCount = contentText.split(/\s+/).length
  const readTime = Math.ceil(wordCount / 200)

  const blogUrl = `https://mahabharatadialogues.com/blogs/${blog.slug}`
  

  const imageUrl = blog.image_url.startsWith('http') 
    ? blog.image_url 
    : `https://mahabharatadialogues.com${blog.image_url}`

  return {
    title: `${blog.title} | Mahabharata Dialogues`,
    description: description,
    keywords: blog.categories?.join(', ') || '',
    authors: [{ name: blog.author }],
    

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
          type: 'image/jpeg',
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: blog.created_at,
      modifiedTime: blog.created_at,
      authors: [blog.author],
      tags: blog.categories,
    },

   
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: description,
      creator: `@${blog.author.replace(/\s+/g, '')}`,
      images: [imageUrl], 
      site: '@MahabharataDialogues',
    },

    // Robots metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: blogUrl,
    },

    // Additional metadata
    other: {
      'article:published_time': blog.created_at,
      'article:author': blog.author,
      'article:section': blog.categories?.[0] || 'Blog',
      'article:tag': blog.categories?.join(', ') || '',
      
      'og:image': imageUrl,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': blog.title,
      'og:image:type': 'image/jpeg',
    },
  }
}

export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/blogs`)
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

  // Ensure image URL is absolute for structured data
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
          url: `https://mahabharatadialogues.com/author/${blog.author.toLowerCase().replace(/\s+/g, '-')}`,
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
        keywords: blog.categories?.join(', '),
        articleSection: blog.categories?.[0] || 'Blog',
        wordCount: blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
        timeRequired: `PT${Math.ceil(blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)}M`,
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://mahabharatadialogues.com/blogs/${blog.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://mahabharatadialogues.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blogs',
            item: 'https://mahabharatadialogues.com/blogs',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: blog.title,
            item: `https://mahabharatadialogues.com/blogs/${blog.slug}`,
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `https://mahabharatadialogues.com/blogs/${blog.slug}#webpage`,
        url: `https://mahabharatadialogues.com/blogs/${blog.slug}`,
        name: blog.title,
        description: blog.subtitle || blog.content.replace(/<[^>]*>/g, '').trim().substring(0, 160),
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://mahabharatadialogues.com#website',
          name: 'Mahabharata Dialogues',
          url: 'https://mahabharatadialogues.com',
        },
        breadcrumb: {
          '@id': `https://mahabharatadialogues.com/blogs/${blog.slug}#breadcrumb`,
        },
        about: {
          '@id': `https://mahabharatadialogues.com/blogs/${blog.slug}#article`,
        },
      },
    ],
  } : null

  return (
    <>
      {/* Structured Data for SEO */}
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