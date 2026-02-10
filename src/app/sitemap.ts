import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mahabharatadialogues.com'

  // Fetch all blogs
  let blogs: any[] = []
  try {
    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: 'no-store'
    })
    const data = await response.json()
    if (data.success) {
      blogs = data.data
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Dynamic blog pages
  const blogPages = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages]
}