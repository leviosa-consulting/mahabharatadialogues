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

// Helper function to get a shareable image URL
function getSocialShareImageUrl(imageUrl: string): string {
  if (!imageUrl) {
    return 'https://mahabharatadialogues.com/default-og-image.jpg'
  }
  
 
  if (imageUrl.includes('.avif')) {
   
    return imageUrl.replace('.avif', '.jpg')
  }
  
 
  return imageUrl
}

// Fetch blog data on the server
async function getBlogData(slug: string) {
  try {
    // Replace with your actual API URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/blogs/${slug}`
    
    console.log('Fetching blog from:', url)
    
    const response = await fetch(url, {
      cache: 'no-store', 
      // next: { revalidate: 3600 } // Revalidate every hour
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

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogData(slug)

  if (!blog) {
    return {
      title: 'Blog Not Found | Mahabharata Dialogues',
      description: 'The requested blog post could not be found.',
    }
  }

  // Extract text from HTML content
  const contentText = blog.content.replace(/<[^>]*>/g, '').trim()
  const description = blog.subtitle || contentText.substring(0, 160) + '...'
  
  // Calculate reading time
  const wordCount = contentText.split(/\s+/).length
  const readTime = Math.ceil(wordCount / 200)

  const blogUrl = `https://mahabharatadialogues.com/blogs/${blog.slug}`
  
  // Get shareable image URL (converts AVIF to JPEG if needed)
  const shareableImageUrl = getSocialShareImageUrl(blog.image_url)

  return {
    title: `${blog.title} | Mahabharata Dialogues`,
    description: description,
    keywords: blog.categories?.join(', ') || '',
    authors: [{ name: blog.author }],
    
    // Open Graph metadata (Facebook, LinkedIn, etc.)
    openGraph: {
      title: blog.title,
      description: description,
      url: blogUrl,
      siteName: 'Mahabharata Dialogues',
      images: [
        {
          url: shareableImageUrl,
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

    // Twitter metadata
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: description,
      creator: `@${blog.author.replace(/\s+/g, '')}`,
      images: {
        url: shareableImageUrl,
        alt: blog.title,
      },
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

   
    verification: {
    
    },

    // Additional metadata
    other: {
      'article:published_time': blog.created_at,
      'article:author': blog.author,
      'article:section': blog.categories?.[0] || 'Blog',
      'article:tag': blog.categories?.join(', ') || '',
    },
  }
}

// Optional: Generate static params for all blogs (for static site generation)
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

// Server Component - This renders on the server
export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlogData(slug)

  // Generate structured data for rich snippets
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
          url: getSocialShareImageUrl(blog.image_url),
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
      
      {/* Client Component handles all interactivity */}
      <BlogDetailClient initialBlog={blog} slug={slug} />
    </>
  )
}