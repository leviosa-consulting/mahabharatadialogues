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

  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);

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
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold mb-4">Mahabharata Dialogues Blogs</h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Explore deep insights, knowledge, and timeless wisdom from the
            Mahabharata.
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="max-w-7xl mx-auto px-6 py-10">
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg"
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
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
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
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
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
                  className="mt-4 flex items-center gap-2 text-purple-600"
                >
                  <X size={16} /> Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Blog Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative h-56">
                {blog.image_url ? (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-purple-200">
                    <Tag size={48} className="text-white" />
                  </div>
                )}

                {blog.categories?.length > 0 && (
                  <span className="absolute top-4 left-4 bg-white px-3 py-1 text-purple-600 rounded-full text-sm font-semibold">
                    {blog.categories[0]}
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex gap-4 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {formatDate(blog.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={14} /> {blog.author}
                  </span>
                </div>

                <h2 className="text-xl font-bold line-clamp-2 group-hover:text-purple-600 transition">
                  {blog.title}
                </h2>

                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {blog.subtitle?.slice(0, 100)}
                  {blog.subtitle?.length > 100 ? "..." : ""}
                </p>

                <div className="mt-4 flex items-center text-purple-600 font-semibold">
                  Read More
                  <ChevronRight size={20} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
