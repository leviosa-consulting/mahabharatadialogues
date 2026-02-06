// admin/products/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  Image as ImageIcon,
  Upload,
  BookOpen,
  Gamepad2,
  IndianRupee,
} from 'lucide-react'
import { uploadToFirebaseStorage } from '@/utils/firebaseStorageUpload'
import { generateFullSlug } from '@/utils/slugUtils'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminNavbar from '@/components/AdminNavbar'

interface Product {
  id: string
  name: string
  author: string
  price: number
  category: 'Books' | 'Games'
  image: string
  images?: string[]
  description: string
  slug: string
}

const FALLBACK_IMAGE = '/assets/fallbackImg.jpeg'

const ProductsAdminPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadingMainImage, setUploadingMainImage] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'Books' | 'Games' | 'all'>('all')
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    price: 0,
    category: 'Books' as 'Books' | 'Games',
    image: '',
    images: [] as string[],
    description: '',
    slug: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      // Sort products by name
      const sortedProducts = (data.data || []).sort((a: Product, b: Product) => {
        return a.name.localeCompare(b.name)
      })
      setProducts(sortedProducts)
      setLoading(false)
    } catch (err) {
      alert('Failed to fetch products')
      setLoading(false)
    }
  }

  // Filter products by category
  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(product => product.category === activeTab)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: name === 'price' ? Number(value) : value }

      // Auto-generate slug when name changes
      if (name === 'name') {
        updated.slug = generateFullSlug(value)
      }

      return updated
    })
  }

  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploadingMainImage(true)
    try {
      const downloadURL = await uploadToFirebaseStorage(file, 'products')
      setFormData((prev) => ({ ...prev, image: downloadURL }))
      alert('Main image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading main image:', error)
      alert('Failed to upload main image')
    } finally {
      setUploadingMainImage(false)
    }
  }

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingGallery(true)
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadToFirebaseStorage(file, 'products')
      )
      const urls = await Promise.all(uploadPromises)
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...urls],
      }))
      alert(`${urls.length} image(s) uploaded successfully!`)
    } catch (error) {
      console.error('Error uploading gallery images:', error)
      alert('Failed to upload gallery images')
    } finally {
      setUploadingGallery(false)
    }
  }

  const removeGalleryImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((img) => img !== url),
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      author: '',
      price: 0,
      category: 'Books',
      image: '',
      images: [],
      description: '',
      slug: '',
    })
    setEditingId(null)
    setShowModal(false)
  }

  const handleCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      author: product.author || '',
      price: product.price || 0,
      category: product.category || 'Books',
      image: product.image || '',
      images: product.images || [],
      description: product.description || '',
      slug: product.slug || '',
    })
    setEditingId(product.id)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.author ||
      !formData.description ||
      formData.price <= 0
    ) {
      alert('Name, author, description, and price (greater than 0) are required')
      return
    }

    if (!formData.slug) {
      alert('Slug is required')
      return
    }

    if (submitting) {
      return
    }

    setSubmitting(true)

    try {
      const dataToSubmit = {
        ...formData,
        image: formData.image || FALLBACK_IMAGE,
      }

      const url = editingId ? `/api/products/${editingId}` : '/api/products'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save product')
      }

      alert(
        editingId
          ? 'Product updated successfully!'
          : 'Product created successfully!'
      )
      setShowModal(false)
      resetForm()
      fetchProducts()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete product')

      alert('Product deleted successfully!')
      fetchProducts()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // Check if form is valid for submission
  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.author.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.price > 0 &&
      formData.slug.trim() !== ''
    )
  }

  // Helper function to render description with line breaks
  const renderDescriptionWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ))
  }

  // Render product cards
  const renderProductCards = (productsList: Product[]) => {
    if (productsList.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-12 text-center col-span-full">
          {activeTab === 'Books' ? (
            <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
          ) : activeTab === 'Games' ? (
            <Gamepad2 size={48} className="mx-auto mb-4 text-gray-400" />
          ) : (
            <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
          )}
          <p className="text-gray-600 text-lg">
            No {activeTab !== 'all' ? activeTab.toLowerCase() : 'products'} found.
          </p>
        </div>
      )
    }

    return productsList.map((product) => (
      <div
        key={product.id}
        className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow rounded-lg flex flex-col"
      >
        <div className="h-48 bg-gray-200 overflow-hidden flex-shrink-0">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {product.category === 'Books' ? (
                <BookOpen size={48} />
              ) : (
                <Gamepad2 size={48} />
              )}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
              {product.name}
            </h3>
            <span
              className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                product.category === 'Books'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {product.category}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-2">by {product.author}</p>

          <p className="text-gray-600 text-sm mb-3 line-clamp-3 min-h-[3.75rem]">
            {renderDescriptionWithLineBreaks(product.description)}
          </p>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
              <IndianRupee size={16} />
              <span>₹{product.price}</span>
            </div>
            {product.slug && (
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <span className="truncate">/{product.slug}</span>
              </div>
            )}
          </div>

          <div className="space-y-1 mb-4 flex-grow">
            {product.images && product.images.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ImageIcon size={14} />
                <span>{product.images.length} gallery image(s)</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => handleEdit(product)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminNavbar currentTab={'products'} />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Products Management
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Create, edit, and manage your products catalog
                </p>
              </div>

              <button
                onClick={handleCreate}
                className="flex items-center justify-center cursor-pointer gap-2 bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto"
              >
                <Plus size={20} />
                New Product
              </button>
            </div>
          </div>

       
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {renderProductCards(filteredProducts)}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-20 rounded-t-lg">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Product' : 'Create New Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={submitting}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[calc(90vh-80px)] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *{' '}
                      <span className="text-xs text-gray-500">
                        (Auto-generated from name)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
                      placeholder="product-slug-here-AB12345678"
                    />
                    {formData.slug && (
                      <p className="text-xs text-gray-500 mt-1">
                        URL will be: /products/{formData.slug}
                      </p>
                    )}
                    {editingId && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ Updating the slug will change the product URL. Make
                        sure to update any existing links.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author/Creator *
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="e.g., Abhilash Purohith"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        disabled={submitting}
                        min="0"
                        step="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="e.g., 499"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="Books">Books</option>
                      <option value="Games">Games</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *{' '}
                      <span className="text-xs text-gray-500">
                        (Press Enter for new line)
                      </span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed whitespace-pre-wrap"
                      placeholder="Enter product description&#10;Press Enter to add a new line&#10;Multiple paragraphs are supported"
                      style={{ fontFamily: 'inherit' }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Tip: Line breaks will be preserved when displayed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Product Image{' '}
                      <span className="text-xs text-gray-500">
                        (Optional - fallback image will be used if not uploaded)
                      </span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="hidden"
                        id="main-image-upload"
                        disabled={uploadingMainImage || submitting}
                      />
                      <label
                        htmlFor="main-image-upload"
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                          uploadingMainImage || submitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        <ImageIcon size={20} />
                        {uploadingMainImage ? 'Uploading...' : 'Upload Main Image'}
                      </label>
                      {formData.image && (
                        <div className="flex items-center gap-2">
                          <img
                            src={formData.image}
                            alt="Main preview"
                            className="h-12 w-12 object-cover rounded"
                          />
                          <button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                image: '',
                              }))
                            }
                            disabled={submitting}
                            className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                    {!formData.image && (
                      <p className="text-sm text-blue-600 mt-2">
                        ℹ️ Fallback image ({FALLBACK_IMAGE}) will be used
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gallery Images
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                        id="gallery-upload"
                        disabled={uploadingGallery || submitting}
                      />
                      <label
                        htmlFor="gallery-upload"
                        className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
                          uploadingGallery || submitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        <Upload size={20} />
                        {uploadingGallery
                          ? 'Uploading...'
                          : 'Upload Gallery Images'}
                      </label>
                      {formData.images && formData.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {formData.images.map((url, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={url}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                              <button
                                onClick={() => removeGalleryImage(url)}
                                disabled={submitting}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setShowModal(false)
                        resetForm()
                      }}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={
                        !isFormValid() ||
                        uploadingMainImage ||
                        uploadingGallery ||
                        submitting
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          {editingId ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          {editingId ? 'Update Product' : 'Create Product'}
                        </>
                      )}
                    </button>
                  </div>

                  {!isFormValid() && (
                    <div className="text-sm text-red-600 text-center">
                      ⚠️ Please fill all required fields (Name, Author, Price , Category, Description, Slug)
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ProductsAdminPage