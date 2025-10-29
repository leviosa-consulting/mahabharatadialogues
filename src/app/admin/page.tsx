
'use client'

import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, Save, X, FileText } from 'lucide-react'

import ProtectedRoute from '@/components/ProtectedRoute'
interface Article {
  id: string
  title: string
  subtitle: string
  image_url: string
  slug: string
  content: string
  description: string
}

const ArticleAdminPage = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    slug: '',
    content: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      const data = await response.json()
      setArticles(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch articles')
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      slug: '',
      content: '',
      description: '',
    })
    setEditingId(null)
    setShowModal(false)
    setError('')
    setSuccess('')
  }

  const handleCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      subtitle: article.subtitle || '',
      image_url: article.image_url || '',
      slug: article.slug,
      content: article.content || '',
      description: article.description || '',
    })
    setEditingId(article.id)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!formData.title || !formData.slug || !formData.content) {
      alert('Title, slug, and content are required')
      return
    }

    try {
      const url = editingId ? `/api/articles/${editingId}` : '/api/articles'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save article')

      alert(
        editingId
          ? 'Article updated successfully!'
          : 'Article created successfully!'
      )
      setShowModal(false)
      resetForm()
      fetchArticles()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete article')

      alert('Article deleted successfully!')
      fetchArticles()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
      <ProtectedRoute requireAdmin={true}>
    <div>
     
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Article Management
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Create, edit, and manage your blog articles
                </p>
              </div>

              <button
                onClick={handleCreate}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer w-full sm:w-auto"
              >
                <Plus size={20} />
                New Article
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg">
                No articles found. Create your first article!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={`/${article.image_url}`}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FileText size={48} />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    {article.subtitle && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {article.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mb-4">
                      Slug: <span className="font-mono">{article.slug}</span>
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Article' : 'Create New Article'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="Enter article title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug * (auto-generated)
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="article-slug"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter article subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image PATH
                    </label>
                    <input
                      type="text"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="assets/articles/image.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter article description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content (HTML) *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={12}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent font-mono text-sm"
                      placeholder="<h2>Heading</h2><p>Content...</p>"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Enter HTML content directly. Use proper HTML tags.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setShowModal(false)
                        resetForm()
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      <Save size={20} />
                      {editingId ? 'Update Article' : 'Create Article'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}

export default ArticleAdminPage
