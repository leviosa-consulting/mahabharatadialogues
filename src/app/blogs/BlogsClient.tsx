"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  X,
  Calendar,
  User,
  Tag,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface Blog {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  slug: string;
  content: string;
  author: string;
  categories: string[];
  created_at: string;
}

export default function BlogsClient({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs || []);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>(initialBlogs || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(initialBlogs.length === 0);

  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  // Fetch blogs client-side if not provided by server
  useEffect(() => {
    if (initialBlogs.length === 0) {
      fetchBlogsClientSide();
    }
  }, []);

  const fetchBlogsClientSide = async () => {
    try {
      console.log("🔄 Fetching blogs client-side...");
      setIsLoading(true);
      
      const res = await fetch('/api/blogs');
      
      if (!res.ok) {
        console.error("❌ Client-side fetch failed:", res.status);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      const fetchedBlogs = data.data || data.blogs || [];
      
      console.log("✅ Client-side blogs fetched:", fetchedBlogs.length);
      
      setBlogs(fetchedBlogs);
      setFilteredBlogs(fetchedBlogs);
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error fetching blogs client-side:", error);
      setIsLoading(false);
    }
  };

  // Add structured data on mount
  useEffect(() => {
    if (blogs.length > 0) {
      addStructuredData();
    }
  }, [blogs]);

  const addStructuredData = () => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create BlogPosting list structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Mahabharata Dialogues Blogs",
      "description": "Explore deep insights, knowledge, and timeless wisdom from the Mahabharata",
      "url": "https://mahabharatadialogues.com/blogs",
      "blogPost": blogs.slice(0, 10).map(blog => ({
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.subtitle,
        "image": blog.image_url,
        "author": {
          "@type": "Person",
          "name": blog.author,
        },
        "datePublished": blog.created_at,
        "url": `https://mahabharatadialogues.com/blogs/${blog.slug}`,
      })),
    };

    // Create BreadcrumbList structured data
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://mahabharatadialogues.com",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blogs",
          "item": "https://mahabharatadialogues.com/blogs",
        },
      ],
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify([structuredData, breadcrumbData]);
    document.head.appendChild(script);
  };

  // Build author and category lists
  useEffect(() => {
    const authors = Array.from(
      new Set(blogs.map((b) => b.author).filter(Boolean))
    ) as string[];

    const categories = Array.from(
      new Set(blogs.flatMap((b) => b.categories || []))
    ) as string[];

    setAllAuthors(authors.sort());
    setAllCategories(categories.sort());
  }, [blogs]);

  // Filtering logic
  useEffect(() => {
    filterBlogs();
  }, [searchQuery, selectedAuthor, selectedCategory, blogs]);

  const filterBlogs = () => {
    let filtered = blogs;

    if (searchQuery) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedAuthor) {
      filtered = filtered.filter((blog) => blog.author === selectedAuthor);
    }

    if (selectedCategory) {
      filtered = filtered.filter((blog) =>
        blog.categories?.includes(selectedCategory)
      );
    }

    setFilteredBlogs(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedAuthor("");
    setSelectedCategory("");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  const hasActiveFilters = searchQuery || selectedAuthor || selectedCategory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* SEO Breadcrumbs */}
      <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-purple-600">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight size={16} className="text-gray-400" />
            </li>
            <li>
              <span className="text-gray-900 font-medium">Blogs</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold mb-4">Mahabharata Dialogues Blogs</h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Explore deep insights, knowledge, and timeless wisdom from the
            Mahabharata.
          </p>
        </div>
      </header>

      {/* Search + Filters */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, subtitle or author..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                aria-label="Search blogs"
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              aria-label="Toggle filters"
            >
              <Filter size={20} />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-white text-purple-600 rounded-full text-xs font-semibold">
                  {[searchQuery, selectedAuthor, selectedCategory].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filter options */}
          {showFilters && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="author-filter" className="text-sm font-medium mb-2 block">
                    Author
                  </label>
                  <select
                    id="author-filter"
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                  <label htmlFor="category-filter" className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                  className="mt-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <X size={16} /> Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        {blogs.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredBlogs.length}</span> of{" "}
              <span className="font-semibold">{blogs.length}</span> blogs
              {hasActiveFilters && " (filtered)"}
            </p>
          </div>
        )}

        {/* Blog Cards Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link href={`/blogs/${blog.slug}`}>
                  <div className="relative h-56 overflow-hidden">
                    {blog.image_url ? (
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-500">
                        <Tag size={48} className="text-white" />
                      </div>
                    )}

                    {blog.categories?.length > 0 && (
                      <span className="absolute top-4 left-4 bg-white px-3 py-1 text-purple-600 rounded-full text-sm font-semibold shadow-md">
                        {blog.categories[0]}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex gap-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} aria-hidden="true" />
                        <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} aria-hidden="true" />
                        {blog.author}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold line-clamp-2 group-hover:text-purple-600 transition-colors mb-2">
                      {blog.title}
                    </h2>

                    {blog.subtitle && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {blog.subtitle}
                      </p>
                    )}

                    <div className="mt-4 flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                      Read More
                      <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading blogs...</h2>
                <p className="text-gray-600">Please wait while we fetch the latest blogs.</p>
              </>
            ) : (
              <>
                <Tag size={48} className="text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No blogs available</h2>
                <p className="text-gray-600">Check back soon for new blogs.</p>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
              <Search size={48} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No blogs found</h2>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
  );
}