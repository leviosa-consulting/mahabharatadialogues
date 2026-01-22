'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  X,
  Calendar,
  User,
  Tag,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { merri } from '@/app/fonts/merri'
import Navbar from '@/components/Navbar'

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

export default function BlogsClient({
  initialBlogs,
}: {
  initialBlogs: Blog[]
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlCategory = searchParams?.get('category')

  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs || [])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>(initialBlogs || [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>(
    urlCategory || ''
  )
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(initialBlogs.length === 0)

  const [allAuthors, setAllAuthors] = useState<string[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])

  // Update selected category when URL changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory)
      setShowFilters(true)
    } else {
      setSelectedCategory('')
    }
  }, [urlCategory])

  // Fetch blogs client-side if not provided by server
  useEffect(() => {
    if (initialBlogs.length === 0) {
      fetchBlogsClientSide()
    }
  }, [])

  const fetchBlogsClientSide = async () => {
    try {
      console.log('🔄 Fetching blogs client-side...')
      setIsLoading(true)

      const res = await fetch('/api/blogs')

      if (!res.ok) {
        console.error('❌ Client-side fetch failed:', res.status)
        setIsLoading(false)
        return
      }

      const data = await res.json()
      const fetchedBlogs = data.data || data.blogs || []

      console.log('✅ Client-side blogs fetched:', fetchedBlogs.length)

      setBlogs(fetchedBlogs)
      setFilteredBlogs(fetchedBlogs)
      setIsLoading(false)
    } catch (error) {
      console.error('❌ Error fetching blogs client-side:', error)
      setIsLoading(false)
    }
  }

  // Add structured data on mount
  useEffect(() => {
    if (blogs.length > 0) {
      addStructuredData()
    }
  }, [blogs])

  const addStructuredData = () => {
    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    )
    if (existingScript) {
      existingScript.remove()
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Mahabharata Dialogues Blogs',
      description:
        'Explore deep insights, knowledge, and timeless wisdom from the Mahabharata',
      url: 'https://mahabharatadialogues.com/blogs',
      blogPost: blogs.slice(0, 10).map((blog) => ({
        '@type': 'BlogPosting',
        headline: blog.title,
        description: blog.subtitle,
        image: blog.image_url,
        author: {
          '@type': 'Person',
          name: blog.author,
        },
        datePublished: blog.created_at,
        url: `https://mahabharatadialogues.com/blogs/${blog.slug}`,
      })),
    }

    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
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
      ],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify([structuredData, breadcrumbData])
    document.head.appendChild(script)
  }

  // Build author and category lists
  useEffect(() => {
    const authors = Array.from(
      new Set(blogs.map((b) => b.author).filter(Boolean))
    ) as string[]

    const categories = Array.from(
      new Set(blogs.flatMap((b) => b.categories || []))
    ) as string[]

    setAllAuthors(authors.sort())
    setAllCategories(categories.sort())
  }, [blogs])

  // Filtering logic
  useEffect(() => {
    filterBlogs()
  }, [searchQuery, selectedAuthor, selectedCategory, blogs])

  const filterBlogs = () => {
    let filtered = blogs

    if (searchQuery) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.author?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedAuthor) {
      filtered = filtered.filter((blog) => blog.author === selectedAuthor)
    }

    if (selectedCategory) {
      filtered = filtered.filter((blog) =>
        blog.categories?.includes(selectedCategory)
      )
    }

    setFilteredBlogs(filtered)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedAuthor('')
    setSelectedCategory('')
    router.push('/blogs')
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category) {
      router.push(`/blogs?category=${encodeURIComponent(category)}`)
    } else {
      router.push('/blogs')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'Unknown date'
    }
  }

  const hasActiveFilters = searchQuery || selectedAuthor || selectedCategory

  return (
    <div className="min-h-screen bg-[#1D5C75CC]">
      {/* Hero Section */}
      <header className="bg-white ">
       <Navbar textColor='#1D5C75'/>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h1 className="font-neco font-bold text-[#1D5C75] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">
              Mahabharata Dialogues
            </h1>
            <p
              className={`${merri.className} text-[#1D5C75] text-lg md:text-xl lg:text-2xl font-normal`}
            >
              Explore deep insights, knowledge, and timeless wisdom
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Search + Filters */}
        <div className="bg-white shadow-lg p-4 sm:p-6 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1D5C75]"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, subtitle or author..."
                className={`${merri.className} w-full pl-12 pr-4 py-3 border-2 border-[#1D5C75]  focus:ring-2 focus:ring-[#47ABD8] focus:border-[#47ABD8] text-[#1D5C75]`}
                aria-label="Search blogs"
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1D5C75] text-white  hover:bg-[#47ABD8] transition-colors"
              aria-label="Toggle filters"
            >
              <Filter size={20} />
              <span className={`${merri.className} font-medium`}>Filters</span>
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-white text-[#1D5C75] rounded-full text-xs font-semibold">
                  {
                    [searchQuery, selectedAuthor, selectedCategory].filter(
                      Boolean
                    ).length
                  }
                </span>
              )}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="author-filter"
                    className={`${merri.className} text-sm font-semibold text-[#1D5C75] mb-2 block`}
                  >
                    Filter by Author
                  </label>
                  <select
                    id="author-filter"
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className={`${merri.className} w-full px-4 py-2 border-2 border-[#1D5C75]  focus:ring-2 focus:ring-[#47ABD8] focus:border-[#47ABD8] text-[#1D5C75]`}
                  >
                    <option value="">All Authors</option>
                    {allAuthors.map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="category-filter"
                    className={`${merri.className} text-sm font-semibold text-[#1D5C75] mb-2 block`}
                  >
                    Filter by Category
                  </label>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className={`${merri.className} w-full px-4 py-2 border-2 border-[#1D5C75] rounded-lg focus:ring-2 focus:ring-[#47ABD8] focus:border-[#47ABD8] text-[#1D5C75]`}
                  >
                    <option value="">All Categories</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`${merri.className} mt-4 flex items-center gap-2 text-[#1D5C75] hover:text-[#47ABD8] font-semibold transition-colors`}
                >
                  <X size={16} /> Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active Filter Badge */}
        {selectedCategory && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 bg-[#1D5C75] text-white px-4 py-2 ">
              <span className={`${merri.className} text-sm font-medium`}>
                Category: {selectedCategory}
              </span>
              <button
                onClick={() => handleCategoryChange('')}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="Clear category filter"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {blogs.length > 0 && (
          <div className="mb-6">
            <p className={`${merri.className} text-white text-sm md:text-base`}>
              Showing <span className="font-bold">{filteredBlogs.length}</span>{' '}
              of <span className="font-bold">{blogs.length}</span> blogs
              {hasActiveFilters && ' (filtered)'}
            </p>
          </div>
        )}

        {/* Blog Cards Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white  shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/blogs/${blog.slug}`}>
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    {blog.image_url ? (
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#1D5C75] to-[#47ABD8]">
                        <Tag size={48} className="text-white" />
                      </div>
                    )}

                    {blog.categories?.length > 0 && (
                      <span
                        className={`${merri.className} absolute top-4 left-4 bg-white px-3 py-1 text-[#1D5C75] rounded-full text-xs font-semibold shadow-md`}
                      >
                        {blog.categories[0]}
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-6">
                    <div
                      className={`${merri.className} flex flex-wrap gap-3 text-xs text-[#1D5C75] mb-3`}
                    >
                      <span className="flex items-center gap-1">
                        <Calendar size={14} aria-hidden="true" />
                        <time dateTime={blog.created_at}>
                          {formatDate(blog.created_at)}
                        </time>
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} aria-hidden="true" />
                        {blog.author}
                      </span>
                    </div>

                    <h2 className="font-neco font-bold text-[#1D5C75] text-lg sm:text-xl line-clamp-2 group-hover:text-[#47ABD8] transition-colors mb-2">
                      {blog.title}
                    </h2>

                    {blog.subtitle && (
                      <p
                        className={`${merri.className} text-[#1D5C75] text-sm line-clamp-3 mb-4`}
                      >
                        {blog.subtitle}
                      </p>
                    )}

                    <div
                      className={`${merri.className} flex items-center text-[#1D5C75] font-semibold group-hover:text-[#47ABD8] transition-all`}
                    >
                      Read More
                      <ChevronRight
                        size={20}
                        className="ml-1 group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white shadow-lg">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-12 w-12 text-[#1D5C75] mx-auto mb-4" />
                <h2 className="font-neco text-2xl font-bold text-[#1D5C75] mb-2">
                  Loading blogs...
                </h2>
                <p className={`${merri.className} text-[#1D5C75]`}>
                  Please wait while we fetch the latest blogs.
                </p>
              </>
            ) : (
              <>
                <Tag size={48} className="text-[#1D5C75] mx-auto mb-4" />
                <h2 className="font-neco text-2xl font-bold text-[#1D5C75] mb-2">
                  No blogs available
                </h2>
                <p className={`${merri.className} text-[#1D5C75]`}>
                  Check back soon for new blogs.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white r shadow-lg p-8 sm:p-12 max-w-md mx-auto">
              <Search size={48} className="text-[#1D5C75] mx-auto mb-4" />
              <h2 className="font-neco text-2xl font-bold text-[#1D5C75] mb-2">
                No blogs found
              </h2>
              <p className={`${merri.className} text-[#1D5C75] mb-6`}>
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`${merri.className} inline-flex items-center gap-2 px-6 py-3 bg-[#1D5C75] text-white  hover:bg-[#47ABD8] transition-colors font-medium`}
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
