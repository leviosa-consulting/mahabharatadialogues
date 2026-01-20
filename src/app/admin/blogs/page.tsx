'use client'

import React, { useState, useEffect } from 'react'
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  FileText,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Tag,
  User,
  YoutubeIcon,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { uploadToFirebaseStorage } from '@/utils/firebaseStorageUpload'

import ProtectedRoute from '@/components/ProtectedRoute'
import AdminNavbar from '@/components/AdminNavbar'

interface Blog {
  id: string
  title: string
  subtitle: string
  image_url: string
  slug: string
  content: string
  author: string
  categories: string[]
}

const MenuBar = ({ editor }: any) => {
  if (!editor) return null

  const addImage = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      try {
        const downloadURL = await uploadToFirebaseStorage(file, 'blogs')
        editor.chain().focus().setImage({ src: downloadURL }).run()
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload image')
      }
    }
  }

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL:')
    if (!url) return

    try {
      // Extract video ID from various YouTube URL formats
      let videoId = ''

      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0]
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0]
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0]
      }

      if (!videoId) {
        alert('Invalid YouTube URL. Please enter a valid YouTube link.')
        return
      }

      // Insert YouTube video using TipTap command
      editor.commands.setYoutubeVideo({
        src: `https://www.youtube.com/watch?v=${videoId}`,
      })
    } catch (error) {
      console.error('Error adding YouTube video:', error)
      alert('Failed to add YouTube video')
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = prompt('Enter URL:', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1 bg-gray-50 sticky top-0 z-10">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors font-semibold ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Heading 1"
      >
        <Heading1 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors font-semibold ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Heading 2"
      >
        <Heading2 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('paragraph')
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Normal Text"
      >
        <Type size={20} />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bold')
            ? 'bg-purple-200 text-purple-700 font-bold'
            : 'text-gray-700'
        }`}
        type="button"
        title="Bold"
      >
        <Bold size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('italic')
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Italic"
      >
        <Italic size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('underline')
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Underline"
      >
        <span className="underline font-semibold text-lg">U</span>
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        onClick={setLink}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('link')
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Add Link"
      >
        <LinkIcon size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className={`px-3 py-2 rounded transition-colors ${
          !editor.isActive('link')
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-200'
        }`}
        type="button"
        title="Remove Link"
      >
        <Unlink size={20} />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bulletList')
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Bullet List"
      >
        <List size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('orderedList')
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Numbered List"
      >
        <ListOrdered size={20} />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        onClick={addImage}
        className="px-3 py-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
        type="button"
        title="Insert Image"
      >
        <ImageIcon size={20} />
      </button>
      <button
        onClick={addYoutubeVideo}
        className="px-3 py-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
        type="button"
        title="Insert YouTube Video"
      >
        <YoutubeIcon size={20} />
      </button>
      <div className="w-px bg-gray-300 mx-1"></div>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: 'left' })
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Align Left"
      >
        <AlignLeft size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: 'center' })
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Align Center"
      >
        <AlignCenter size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`px-3 py-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive({ textAlign: 'right' })
            ? 'bg-purple-200 text-purple-700'
            : 'text-gray-700'
        }`}
        type="button"
        title="Align Right"
      >
        <AlignRight size={20} />
      </button>
    </div>
  )
}

const BlogAdminPage = () => {
  const [Blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    slug: '',
    content: '',
    author: '',
    categories: [] as string[],
  })
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false)
  const [categoryInput, setCategoryInput] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-600 underline hover:text-purple-700',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Youtube.configure({
        controls: true,
        nocookie: true,
        modestBranding: true,
        width: 560,
        height: 315,
        inline: false,
        HTMLAttributes: {
          class: 'youtube-video-wrapper',
        },
        addPasteHandler: true,
      }),
    ],
    content: formData.content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }))
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[400px] p-4',
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain')
        if (
          text &&
          (text.includes('youtube.com') || text.includes('youtu.be'))
        ) {
          event.preventDefault()

          let videoId = ''
          if (text.includes('youtube.com/watch?v=')) {
            videoId = text.split('v=')[1]?.split('&')[0]
          } else if (text.includes('youtu.be/')) {
            videoId = text.split('youtu.be/')[1]?.split('?')[0]
          }

          if (videoId && editor) {
            editor.commands.setYoutubeVideo({
              src: `https://www.youtube.com/watch?v=${videoId}`,
            })
            return true
          }
        }
        return false
      },
    },
  })

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content)
    }
  }, [formData.content, editor])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs')
      const data = await response.json()
      setBlogs(data.data)
      setLoading(false)
    } catch (err) {
      alert('Failed to fetch Blogs')
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

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploadingCoverImage(true)
    try {
      const downloadURL = await uploadToFirebaseStorage(file, 'blogs')
      setFormData((prev) => ({ ...prev, image_url: downloadURL }))
      alert('Cover image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading cover image:', error)
      alert('Failed to upload cover image')
    } finally {
      setUploadingCoverImage(false)
    }
  }

  const addCategory = () => {
    if (!categoryInput.trim()) return
    if (formData.categories.includes(categoryInput.trim())) {
      alert('Category already added')
      return
    }
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, categoryInput.trim()],
    }))
    setCategoryInput('')
  }

  const removeCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      slug: '',
      content: '',
      author: '',
      categories: [],
    })
    setEditingId(null)
    setShowModal(false)
    setCategoryInput('')
    if (editor) {
      editor.commands.setContent('')
    }
  }

  const handleCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      subtitle: blog.subtitle || '',
      image_url: blog.image_url || '',
      slug: blog.slug,
      content: blog.content || '',
      author: blog.author || '',
      categories: blog.categories || [],
    })
    setEditingId(blog.id)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.slug ||
      !formData.content ||
      !formData.author
    ) {
      alert('Title, slug, author, and content are required')
      return
    }

    try {
      const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save blog')
      }

      alert(
        editingId ? 'Blog updated successfully!' : 'Blog created successfully!'
      )
      setShowModal(false)
      resetForm()
      fetchBlogs()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Blog?')) return

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete Blog')

      alert('Blog deleted successfully!')
      fetchBlogs()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminNavbar currentTab="blogs" />
      <div>
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
          <style jsx global>{`
            .ProseMirror {
              min-height: 400px;
              padding: 1rem;
            }

            .ProseMirror h1 {
              font-size: 2.25em;
              font-weight: 700;
              line-height: 1.2;
              margin-top: 0.67em;
              margin-bottom: 0.67em;
              color: #1a1a1a;
            }

            .ProseMirror h2 {
              font-size: 1.75em;
              font-weight: 600;
              line-height: 1.3;
              margin-top: 0.75em;
              margin-bottom: 0.5em;
              color: #2a2a2a;
            }

            .ProseMirror h3 {
              font-size: 1.5em;
              font-weight: 600;
              line-height: 1.4;
              margin-top: 0.75em;
              margin-bottom: 0.5em;
              color: #3a3a3a;
            }

            .ProseMirror p {
              font-size: 1em;
              line-height: 1.75;
              margin-top: 0.5em;
              margin-bottom: 0.5em;
              color: #4a4a4a;
            }

            .ProseMirror ul,
            .ProseMirror ol {
              padding-left: 1.5em;
              margin: 0.75em 0;
            }

            .ProseMirror ul {
              list-style: disc outside;
            }

            .ProseMirror ol {
              list-style: decimal outside;
            }

            .ProseMirror li {
              margin: 0.25em 0;
              line-height: 1.7;
              display: list-item;
            }

            /* Optional: improve marker visibility */
            .ProseMirror li::marker {
              color: #4a4a4a;
            }

            .ProseMirror img {
              max-width: 100%;
              height: auto;
              border-radius: 0.5rem;
              margin: 1rem 0;
            }

            .ProseMirror iframe {
              max-width: 640px;
              width: 100%;
              height: 315px;
              border-radius: 0.5rem;
              margin: 1rem auto;
              border: none;
              display: block;
            }

            .ProseMirror div[data-youtube-video] {
              margin: 1rem 0;
              max-width: 640px;
              width: 100%;
            }

            .ProseMirror div[data-youtube-video] iframe {
              max-width: 640px;
              width: 100%;
              height: 315px;
              border-radius: 0.5rem;
              border: none;
              display: block;
            }

            .ProseMirror .ProseMirror-selectednode div[data-youtube-video] {
              outline: 2px solid #7c3aed;
              border-radius: 0.5rem;
            }

            .ProseMirror strong {
              font-weight: 700;
            }

            .ProseMirror em {
              font-style: italic;
            }

            .ProseMirror u {
              text-decoration: underline;
            }

            .ProseMirror a {
              color: #7c3aed;
              text-decoration: underline;
              cursor: pointer;
            }

            .ProseMirror a:hover {
              color: #6d28d9;
            }

            .ProseMirror:focus {
              outline: none;
            }

            .ProseMirror p.is-editor-empty:first-child::before {
              color: #adb5bd;
              content: attr(data-placeholder);
              float: left;
              height: 0;
              pointer-events: none;
            }
          `}</style>
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Blog Management
                  </h1>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    Create, edit, and manage your Blogs
                  </p>
                </div>

                <button
                  onClick={handleCreate}
                  className="flex items-center justify-center cursor-pointer gap-2 bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto"
                >
                  <Plus size={20} />
                  New Blog
                </button>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading Blogs...</p>
              </div>
            ) : Blogs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 text-lg">
                  No Blogs found. Create your first Blog!
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow rounded-lg"
                  >
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      {blog.image_url ? (
                        <img
                          src={blog.image_url}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FileText size={48} />
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl h-14 font-bold text-gray-900 mb-2 line-clamp-2">
                        {blog.title.length > 45
                          ? blog.title.slice(0, 45) + '...'
                          : blog.title}
                      </h3>
                      {blog.subtitle && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {blog.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <User size={14} />
                        <span>{blog.author || 'Unknown'}</span>
                      </div>
                      {blog.categories && blog.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {blog.categories.slice(0, 3).map((cat) => (
                            <span
                              key={cat}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                            >
                              {cat}
                            </span>
                          ))}
                          {blog.categories.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{blog.categories.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mb-4">
                        Slug: <span className="font-mono">{blog.slug}</span>
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
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
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
                  <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-20 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingId ? 'Edit Blog' : 'Create New Blog'}
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

                  <div className="p-6 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
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
                          placeholder="Enter blog title"
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
                          placeholder="blog-slug"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          placeholder="Enter blog subtitle"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Author *
                        </label>
                        <input
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          placeholder="Enter author name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categories
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addCategory()
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          placeholder="Add a category"
                        />
                        <button
                          onClick={addCategory}
                          type="button"
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      {formData.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.categories.map((cat) => (
                            <span
                              key={cat}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              <Tag size={14} />
                              {cat}
                              <button
                                onClick={() => removeCategory(cat)}
                                type="button"
                                className="hover:text-purple-900"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          className="hidden"
                          id="cover-image-upload"
                        />
                        <label
                          htmlFor="cover-image-upload"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <ImageIcon size={20} />
                          {uploadingCoverImage
                            ? 'Uploading...'
                            : 'Upload Cover Image'}
                        </label>
                        {formData.image_url && (
                          <div className="flex items-center gap-2">
                            <img
                              src={formData.image_url}
                              alt="Cover preview"
                              className="h-12 w-12 object-cover rounded"
                            />
                            <button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  image_url: '',
                                }))
                              }
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Upload a cover image for your blog
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content *{' '}
                        <span className="text-sm font-normal text-gray-500">
                          (Select text and click link button to add URLs)
                        </span>
                      </label>

                      <div className="border border-gray-300 rounded-lg bg-white h-[500px] flex flex-col overflow-hidden">
                        <div className="sticky top-0 z-20 bg-white border-b">
                          <MenuBar editor={editor} />
                        </div>

                        <div className="flex-1 overflow-y-auto px-3 py-2">
                          <EditorContent editor={editor} />
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mt-2">
                        💡 <strong>Tip:</strong> Select text and click the link
                        button (🔗) to add URLs. Use the image button to upload
                        images and YouTube button to embed videos.
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4 bottom-0 bg-white pb-2">
                      <button
                        onClick={() => {
                          setShowModal(false)
                          resetForm()
                        }}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Save size={20} />
                        {editingId ? 'Update Blog' : 'Create Blog'}
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

export default BlogAdminPage
