'use client'

import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { merri } from '../fonts/merri'
import Link from 'next/link'
import Footer from '@/components/Footer'
import BlogsShimmer from '@/components/shimmer/BlogsShimmer'
import { useSearchParams } from 'next/navigation'

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

const BlogsClient = () => {
  const searchParams = useSearchParams()

  // State management
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('All')
  const [selectedReadingTime, setSelectedReadingTime] = useState<string>('All')
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [allAuthors, setAllAuthors] = useState<string[]>([])
  const [allReadingTimes, setAllReadingTimes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  
  const categoriesContainerRef = useRef<HTMLDivElement>(null)
  const readingTimeContainerRef = useRef<HTMLDivElement>(null)
  const hasAppliedUrlParams = useRef(false)

 
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [showAllReadingTimes, setShowAllReadingTimes] = useState(false)
  
  
  const [maxCategoryItems, setMaxCategoryItems] = useState<number | null>(null)
  const [maxReadingTimeItems, setMaxReadingTimeItems] = useState<number | null>(null)


  useEffect(() => {
    if (!categoriesContainerRef.current || allCategories.length === 0) return

    const measureLayout = () => {
      const container = categoriesContainerRef.current
      if (!container) return

      const allItems = ['All', ...allCategories]
      const children = Array.from(container.children) as HTMLElement[]
      
      if (children.length === 0) return

      // Get position of first item
      const firstItemTop = children[0].offsetTop
      let secondRowTop: number | null = null
      let thirdRowTop: number | null = null

      // Find where second row starts
      for (let i = 1; i < children.length; i++) {
        if (children[i].offsetTop > firstItemTop) {
          secondRowTop = children[i].offsetTop
          break
        }
      }

      // If no second row, all items fit in one row
      if (!secondRowTop) {
        setMaxCategoryItems(null) // null means no limit needed
        return
      }

      // Find where third row starts
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetTop > secondRowTop) {
          thirdRowTop = children[i].offsetTop
          break
        }
      }

     
      if (!thirdRowTop) {
        setMaxCategoryItems(null) 
        return
      }

      // Count items in first two rows
      let itemsInFirstTwoRows = 0
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetTop < thirdRowTop) {
          itemsInFirstTwoRows++
        } else {
          break
        }
      }

      setMaxCategoryItems(itemsInFirstTwoRows)
    }

    
    const timeoutId = setTimeout(measureLayout, 100)
    
    window.addEventListener('resize', measureLayout)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', measureLayout)
    }
  }, [allCategories])

 
  useEffect(() => {
    if (!readingTimeContainerRef.current || allReadingTimes.length === 0) return

    const measureLayout = () => {
      const container = readingTimeContainerRef.current
      if (!container) return

      const allItems = ['All', ...allReadingTimes]
      const children = Array.from(container.children) as HTMLElement[]
      
      if (children.length === 0) return

      const firstItemTop = children[0].offsetTop
      let secondRowTop: number | null = null
      let thirdRowTop: number | null = null

      for (let i = 1; i < children.length; i++) {
        if (children[i].offsetTop > firstItemTop) {
          secondRowTop = children[i].offsetTop
          break
        }
      }

      if (!secondRowTop) {
        setMaxReadingTimeItems(null)
        return
      }

      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetTop > secondRowTop) {
          thirdRowTop = children[i].offsetTop
          break
        }
      }

      if (!thirdRowTop) {
        setMaxReadingTimeItems(null)
        return
      }

      let itemsInFirstTwoRows = 0
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetTop < thirdRowTop) {
          itemsInFirstTwoRows++
        } else {
          break
        }
      }

      setMaxReadingTimeItems(itemsInFirstTwoRows)
    }

    const timeoutId = setTimeout(measureLayout, 100)
    
    window.addEventListener('resize', measureLayout)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', measureLayout)
    }
  }, [allReadingTimes])

 
  useEffect(() => {
    const handleResize = () => {
      setShowAllCategories(false)
      setShowAllReadingTimes(false)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  
  useEffect(() => {
    fetchBlogs()
  }, [])

  
  useEffect(() => {
    if (blogs.length > 0 && !loading && !hasAppliedUrlParams.current) {
      const categoryParam = searchParams.get('category')
      const authorParam = searchParams.get('author')
      const readingTimeParam = searchParams.get('readingTime')

      if (categoryParam || authorParam || readingTimeParam) {
        // Set the selected filters
        if (categoryParam) {
          setSelectedCategory(categoryParam)
        }
        if (authorParam) {
          setSelectedAuthor(authorParam)
        }
        if (readingTimeParam) {
          setSelectedReadingTime(readingTimeParam)
        }

        // Apply the filters
        applyFilters(
          '',
          categoryParam || 'All',
          authorParam || 'All',
          readingTimeParam || 'All'
        )

        // Mark that we've applied URL params
        hasAppliedUrlParams.current = true
      } else {
        // No URL params, show all blogs
        setFilteredBlogs(blogs)
      }
    }
  }, [blogs.length, loading])

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/blogs')
      const data = await res.json()
      const fetchedBlogs = data.data || data.blogs || []

      setBlogs(fetchedBlogs)
      
      
      const categoryParam = searchParams.get('category')
      const authorParam = searchParams.get('author')
      const readingTimeParam = searchParams.get('readingTime')
      
      if (!categoryParam && !authorParam && !readingTimeParam) {
        setFilteredBlogs(fetchedBlogs)
      }

      // Extract unique categories
      const categories = Array.from(
        new Set(fetchedBlogs.flatMap((b: Blog) => b.categories || [])),
      ) as string[]
      setAllCategories(categories.sort())

      // Extract unique authors
      const authors = Array.from(
        new Set(fetchedBlogs.map((b: Blog) => b.author).filter(Boolean)),
      ) as string[]
      setAllAuthors(authors.sort())

      // Extract unique reading times
      const readingTimes = Array.from(
        new Set(fetchedBlogs.map((b: Blog) => estimateReadTime(b.content)))
      ).sort((a, b) => a - b)
      setAllReadingTimes(readingTimes.map(time => `${time} min read`))

      setLoading(false)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setLoading(false)
    }
  }

  // Format date helper
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

  // Estimate reading time helper
  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const text = content.replace(/<[^>]*>/g, '')
    const wordCount = text.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  // Apply all filters
  const applyFilters = (search: string, category: string, author: string, readingTime: string) => {
    let filtered = blogs

    // Filter by search query
    if (search) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(search.toLowerCase()) ||
          blog.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
          blog.author?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter((blog) => blog.categories?.includes(category))
    }

    // Filter by author
    if (author !== 'All') {
      filtered = filtered.filter((blog) => blog.author === author)
    }

    // Filter by reading time
    if (readingTime !== 'All') {
      const timeInMinutes = parseInt(readingTime.split(' ')[0])
      filtered = filtered.filter((blog) => estimateReadTime(blog.content) === timeInMinutes)
    }

    setFilteredBlogs(filtered)
  }

  // Event handlers
  const handleFilter = () => {
    applyFilters(searchQuery, selectedCategory, selectedAuthor, selectedReadingTime)
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    applyFilters(searchQuery, category, selectedAuthor, selectedReadingTime)
    
    // Update URL
    const params = new URLSearchParams(window.location.search)
    if (category === 'All') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    
    const newUrl = params.toString() ? `/blogs?${params.toString()}` : '/blogs'
    window.history.pushState({}, '', newUrl)
  }

  const handleAuthorClick = (author: string) => {
    setSelectedAuthor(author)
    applyFilters(searchQuery, selectedCategory, author, selectedReadingTime)
    
    // Update URL
    const params = new URLSearchParams(window.location.search)
    if (author === 'All') {
      params.delete('author')
    } else {
      params.set('author', author)
    }
    
    const newUrl = params.toString() ? `/blogs?${params.toString()}` : '/blogs'
    window.history.pushState({}, '', newUrl)
  }

  const handleReadingTimeClick = (readingTime: string) => {
    setSelectedReadingTime(readingTime)
    applyFilters(searchQuery, selectedCategory, selectedAuthor, readingTime)
    
    // Update URL
    const params = new URLSearchParams(window.location.search)
    if (readingTime === 'All') {
      params.delete('readingTime')
    } else {
      params.set('readingTime', readingTime)
    }
    
    const newUrl = params.toString() ? `/blogs?${params.toString()}` : '/blogs'
    window.history.pushState({}, '', newUrl)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedAuthor('All')
    setSelectedReadingTime('All')
    setFilteredBlogs(blogs)
    
    
    window.history.pushState({}, '', '/blogs')
  }

  // Determine which categories to show
  const categoriesToShow = () => {
    const allItems = ['All', ...allCategories]
    
    
    if (showAllCategories || maxCategoryItems === null) {
      return allItems
    }
    
    // Otherwise, show only items that fit in 2 rows
    return allItems.slice(0, maxCategoryItems)
  }

  // Determine which reading times to show
  const readingTimesToShow = () => {
    const allItems = ['All', ...allReadingTimes]
    
    // If we're showing all OR there's no limit (items fit in <=2 rows), show everything
    if (showAllReadingTimes || maxReadingTimeItems === null) {
      return allItems
    }
    
    // Otherwise, show only items that fit in 2 rows
    return allItems.slice(0, maxReadingTimeItems)
  }

  // Should we show the "more" button for categories?
  const needsMoreButtonCategories = () => {
    return maxCategoryItems !== null && !showAllCategories
  }

  // Should we show the "more" button for reading times?
  const needsMoreButtonReadingTimes = () => {
    return maxReadingTimeItems !== null && !showAllReadingTimes
  }

  return (
    <div className="overflow-x-hidden">
      {/* nav */}
      <div>
        <MobileNavbar textColor="#1D5C75" isNotHome />
        <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />
      </div>
      <div className="hidden sm:block relative pt-5 z-10">
        <Navbar textColor="#1D5C75" isNotHome />
      </div>

      {/* first section */}
      <div
        className="w-full relative pb-10 -mt-7 md:-mt-10 xl:-mt-8"
        style={{
          backgroundImage: `
      linear-gradient(#1D5C75CC, #1D5C75CC),
      url('/MD-Texture_BG_Blue-01-04.png')
    `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <div className="max-w-xl mx-auto py-28 flex flex-col justify-center items-center text-center">
          <h2
            className={`${merri.className} text-white uppercase text-[24px] font-extrabold`}
          >
            BLOG
          </h2>
          <p
            className={`${merri.className} text-[#D9D9D9] italic text-[24px] font-normal px-1`}
          >
            Discover our upcoming events and relive the memories from past
            gatherings
          </p>
        </div>

        {/* filters */}
        <div className="px-4 xl:mx-30 max-w-full">
          <div className="grid grid-cols-12 gap-0 md:gap-8">
            <div className="col-span-12 md:col-start-3 md:col-span-8 min-w-0">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 w-full">
                {/* Input wrapper */}
                <div className="flex-1 w-full border-b border-[#D9D9D9]">
                  <input
                    type="text"
                    placeholder="Search a keyword, title or author"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${merri.className} 
        w-full 
        h-12 
        px-3 md:px-5
        text-[#78B0C7] 
        italic 
        font-normal 
        text-[16px] 
        md:text-[18px] 
        bg-transparent 
        outline-none
        placeholder:text-[#78B0C7]`}
                  />
                </div>

                {/* Button */}
                <button
                  onClick={handleFilter}
                  className={`${merri.className} 
      w-full md:w-auto 
      h-12 
      bg-[#1D5C75] 
      text-[#78B0C7] 
      px-12 
      cursor-pointer 
      hover:bg-[#78B0C7] 
      hover:text-[#1D5C75] 
      transition-colors 
      font-bold`}
                >
                  Filter
                </button>
              </div>

              {/* filter categories */}
              <div className="mt-10 mb-5">
                <p
                  className={`${merri.className} text-[#78B0C7] font-extrabold text-[14px] py-1`}
                >
                  CATEGORIES
                </p>
                
                {/* Hidden container for measurement */}
                <div
                  ref={categoriesContainerRef}
                  className="flex flex-wrap gap-2 max-w-full"
                  style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}
                >
                  {['All', ...allCategories].map((category) => (
                    <button
                      key={category}
                      className={`${merri.className} font-bold text-[14px] lg:text-[16px] px-8 md:px-12 py-1 bg-[#78B0C7] text-white`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Visible container with filtered items */}
                <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                  {categoriesToShow().map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`${merri.className} font-bold text-[14px] lg:text-[16px] px-8 md:px-12 py-1 ${
                        selectedCategory === category
                          ? 'bg-[#D9D9D9] text-[#1D5C75]'
                          : 'bg-[#78B0C7] text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}

                  {needsMoreButtonCategories() && (
                    <button
                      onClick={() => setShowAllCategories(true)}
                      className={`${merri.className} font-normal italic text-[14px] lg:text-[16px] px-8 md:px-12 py-1 bg-[#1D5C75] text-[#FFFFFF]`}
                    >
                      more tags...
                    </button>
                  )}

                  {showAllCategories && maxCategoryItems !== null && (
                    <button
                      onClick={() => setShowAllCategories(false)}
                      className={`${merri.className} font-normal italic text-[14px] lg:text-[16px] px-8 md:px-12 py-1 bg-[#1D5C75] text-[#FFFFFF]`}
                    >
                      less tags...
                    </button>
                  )}
                </div>
              </div>

              {/* filter authors */}
              <div className="mb-5">
                <p
                  className={`${merri.className} text-[#78B0C7] font-extrabold text-[14px] py-1`}
                >
                  AUTHOR
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAuthorClick('All')}
                    className={`${merri.className} font-bold text-[14px] lg:text-[16px] px-4 md:px-8 lg:px-12 py-1 transition-colors ${
                      selectedAuthor === 'All'
                        ? 'text-[#1D5C75] bg-[#D9D9D9]'
                        : 'text-[#FFFFFF] bg-[#78B0C7] hover:bg-[#D9D9D9] hover:text-[#1D5C75]'
                    }`}
                  >
                    All
                  </button>

                  {allAuthors.map((author) => (
                    <button
                      key={author}
                      onClick={() => handleAuthorClick(author)}
                      className={`${merri.className} font-bold text-[14px] lg:text-[16px] px-8 md:px-12 py-1 transition-colors ${
                        selectedAuthor === author
                          ? 'text-[#1D5C75] bg-[#D9D9D9]'
                          : 'text-[#FFFFFF] bg-[#78B0C7] hover:bg-[#D9D9D9] hover:text-[#1D5C75]'
                      }`}
                    >
                      {author}
                    </button>
                  ))}
                </div>
              </div>

              {/* READING TIME */}
              <div className="mb-5">
                <p
                  className={`${merri.className} text-[#78B0C7] font-extrabold text-[14px] py-1`}
                >
                  READING TIME
                </p>
                
                {/* Hidden container for measurement */}
                <div
                  ref={readingTimeContainerRef}
                  className="flex flex-wrap gap-2 max-w-full"
                  style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}
                >
                  {['All', ...allReadingTimes].map((readingTime) => (
                    <button
                      key={readingTime}
                      className={`${merri.className} font-bold text-[14px] lg:text-[16px] px-8 md:px-12 py-1 bg-[#78B0C7] text-white`}
                    >
                      {readingTime}
                    </button>
                  ))}
                </div>

                {/* Visible container with filtered items */}
                <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                  {readingTimesToShow().map((readingTime) => (
                    <button
                      key={readingTime}
                      onClick={() => handleReadingTimeClick(readingTime)}
                      className={`${merri.className} font-bold text-[14px] lg:text-[16px] px-8 md:px-12 py-1 transition-colors ${
                        selectedReadingTime === readingTime
                          ? 'text-[#1D5C75] bg-[#D9D9D9]'
                          : 'text-[#FFFFFF] bg-[#78B0C7] hover:bg-[#D9D9D9] hover:text-[#1D5C75]'
                      }`}
                    >
                      {readingTime}
                    </button>
                  ))}

                  {needsMoreButtonReadingTimes() && (
                    <button
                      onClick={() => setShowAllReadingTimes(true)}
                      className={`${merri.className} font-normal italic text-[14px] lg:text-[16px] px-8 md:px-12 py-1 bg-[#1D5C75] text-[#FFFFFF]`}
                    >
                      more tags...
                    </button>
                  )}

                  {showAllReadingTimes && maxReadingTimeItems !== null && (
                    <button
                      onClick={() => setShowAllReadingTimes(false)}
                      className={`${merri.className} font-normal italic text-[14px] lg:text-[16px] px-8 md:px-12 py-1 bg-[#1D5C75] text-[#FFFFFF]`}
                    >
                      less tags...
                    </button>
                  )}
                </div>
              </div>

              {/* Results count */}
              <div className="mb-5">
                <p
                  className={`${merri.className} text-white font-bold pb-20 text-[32px] md:text-[48px]`}
                >
                  {filteredBlogs.length}{' '}
                  <span className="text-[24px] md:text-[36px]">
                    {filteredBlogs.length === 1 ? 'Blog' : 'Blogs'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* blogs */}
      <div
        className="w-full"
        style={{
          backgroundImage: `
    linear-gradient(#47ABD8CC, #47ABD8CC),
    url('/MD-Texture_BG_Blue-01-04.png')
  `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <div className="px-4 relative xl:mx-30 -mt-20 max-w-full overflow-x-hidden">
          <div className="grid grid-cols-12 gap-0 md:gap-8">
            {loading ? (
              <BlogsShimmer />
            ) : filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="col-span-12 md:col-start-2 md:col-span-10 bg-[#FFFFFF] mb-4 min-w-0"
                >
                  <Link href={`/blogs/${blog.slug}`}>
                    <div className="flex flex-col md:flex-row gap-4 cursor-pointer">
                      {/* Left: Image */}
                      <div className="w-full md:w-[340px] flex-shrink-0">
                        <img
                          src={blog.image_url || '/assets/fallbackImg.jpeg'}
                          alt={blog.title}
                          className="w-full h-auto md:w-[340px] md:h-[226px] object-cover"
                        />
                      </div>

                      {/* Right: Content */}
                      <div className="flex-1 flex px-4 md:px-8 py-4 flex-col justify-between">
                        <div>
                          <h2
                            className={`${merri.className} text-[#1D5C75] font-bold text-[32px] italic leading-tight mb-2`}
                          >
                            {blog.title}
                          </h2>
                          <p
                            className={`${merri.className} text-[#1D5C75] font-normal text-[14px] md:text-[16px] mb-1`}
                          >
                            {formatDate(blog.created_at)} | {blog.author}
                          </p>
                          <p
                            className={`${merri.className} text-black font-light italic text-[16px] md:text-[18px] line-clamp-3 md:line-clamp-2 mt-4`}
                          >
                            {blog.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-12 flex justify-center items-center py-20">
                <div className="text-center bg-white p-8 rounded shadow-lg">
                  <p
                    className={`${merri.className} text-[#1D5C75] text-xl mb-4`}
                  >
                    No blogs found
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className={`${merri.className} bg-[#1D5C75] text-white px-6 py-2 hover:bg-[#78B0C7] transition-colors`}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default BlogsClient