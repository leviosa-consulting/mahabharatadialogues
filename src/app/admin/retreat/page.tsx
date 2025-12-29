
'use client'

import React, { useState, useEffect } from 'react'
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  Calendar,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Youtube,
  HelpCircle,
  Trash,
} from 'lucide-react'
import { uploadToFirebaseStorage } from '@/utils/firebaseStorageUpload'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

interface FAQ {
  question: string
  answer: string
}

interface Retreat {
  id: string
  retreatstartData: string
  retreatendData: string
  title: string
  description?: string
  coverImage: string
  gallery?: string[]
  testimonial?: string
  bookingUrl?: string
  youtubeUrl?: string
  faqs?: FAQ[]
}

const RetreatAdminPage = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    retreatstartData: '',
    retreatendData: '',
    title: '',
    description: '',
    coverImage: '',
    gallery: [] as string[],
    testimonial: '',
    bookingUrl: '',
    youtubeUrl: '',
    faqs: [] as FAQ[],
  })

  useEffect(() => {
    fetchRetreats()
  }, [])

  const fetchRetreats = async () => {
    try {
      const response = await fetch('/api/retreat')
      const data = await response.json()
      setRetreats(data.data || [])
      setLoading(false)
    } catch (err) {
      alert('Failed to fetch retreats')
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

    setUploadingCover(true)
    try {
      const downloadURL = await uploadToFirebaseStorage(file, 'retreats')
      setFormData((prev) => ({ ...prev, coverImage: downloadURL }))
      alert('Cover image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading cover image:', error)
      alert('Failed to upload cover image')
    } finally {
      setUploadingCover(false)
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
        uploadToFirebaseStorage(file, 'retreats')
      )
      const urls = await Promise.all(uploadPromises)
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...urls],
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
      gallery: prev.gallery.filter((img) => img !== url),
    }))
  }

  const addFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }))
  }

  const removeFAQ = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }))
  }

  const handleFAQChange = (
    index: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    }))
  }

  const resetForm = () => {
    setFormData({
      retreatstartData: '',
      retreatendData: '',
      title: '',
      description: '',
      coverImage: '',
      gallery: [],
      testimonial: '',
      bookingUrl: '',
      youtubeUrl: '',
      faqs: [],
    })
    setEditingId(null)
    setShowModal(false)
  }

  const handleCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (retreat: Retreat) => {
    setFormData({
      retreatstartData: retreat.retreatstartData || '',
      retreatendData: retreat.retreatendData || '',
      title: retreat.title || '',
      description: retreat.description || '',
      coverImage: retreat.coverImage || '',
      gallery: retreat.gallery || [],
      testimonial: retreat.testimonial || '',
      bookingUrl: retreat.bookingUrl || '',
      youtubeUrl: retreat.youtubeUrl || '',
      faqs: retreat.faqs || [],
    })
    setEditingId(retreat.id)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.retreatstartData ||
      !formData.retreatendData ||
      !formData.coverImage
    ) {
      alert('Title, start date, end date, and cover image are required')
      return
    }

    if (submitting) {
      return
    }

    setSubmitting(true)

    try {
      const url = editingId ? `/api/retreat/${editingId}` : '/api/retreat'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save retreat')
      }

      alert(
        editingId
          ? 'Retreat updated successfully!'
          : 'Retreat created successfully!'
      )
      setShowModal(false)
      resetForm()
      fetchRetreats()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this retreat?')) return

    try {
      const response = await fetch(`/api/retreat/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete retreat')

      alert('Retreat deleted successfully!')
      fetchRetreats()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isFormValid = () => {
    return (
      formData.title.trim() !== '' &&
      formData.retreatstartData !== '' &&
      formData.retreatendData !== '' &&
      formData.coverImage !== ''
    )
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <Navbar currentTab="retreat" />

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Retreats Management
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Create, edit, and manage your retreats
                </p>
              </div>

              <button
                onClick={handleCreate}
                className="flex items-center justify-center cursor-pointer gap-2 bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto"
              >
                <Plus size={20} />
                New Retreat
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading retreats...</p>
            </div>
          ) : retreats.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg">
                No retreats found. Create your first retreat!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {retreats.map((retreat) => (
                <div
                  key={retreat.id}
                  className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow rounded-lg flex flex-col"
                >
                  <div className="h-48 bg-gray-200 overflow-hidden flex-shrink-0">
                    {retreat.coverImage ? (
                      <img
                        src={retreat.coverImage}
                        alt={retreat.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Calendar size={48} />
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {retreat.title}
                    </h3>
                    {retreat.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3 min-h-[3.75rem]">
                        {retreat.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Calendar size={14} />
                      <span>
                        {formatDate(retreat.retreatstartData)} -{' '}
                        {formatDate(retreat.retreatendData)}
                      </span>
                    </div>

                    <div className="space-y-1 mb-4 flex-grow">
                      {retreat.gallery && retreat.gallery.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <ImageIcon size={14} />
                          <span>{retreat.gallery.length} gallery image(s)</span>
                        </div>
                      )}
                      {retreat.youtubeUrl && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Youtube size={14} />
                          <span>YouTube video attached</span>
                        </div>
                      )}
                      {retreat.bookingUrl && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <LinkIcon size={14} />
                          <span>Booking link available</span>
                        </div>
                      )}
                      {retreat.faqs && retreat.faqs.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <HelpCircle size={14} />
                          <span>{retreat.faqs.length} FAQ(s)</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleEdit(retreat)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(retreat.id)}
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
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-20 rounded-t-lg">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Retreat' : 'Create New Retreat'}
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
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter retreat title"
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
                      rows={4}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter retreat description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="retreatstartData"
                        value={formData.retreatstartData}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        name="retreatendData"
                        value={formData.retreatendData}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image *{' '}
                      {!formData.coverImage && (
                        <span className="text-red-600">
                          (Required to create retreat)
                        </span>
                      )}
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                        id="cover-image-upload"
                        disabled={uploadingCover || submitting}
                      />
                      <label
                        htmlFor="cover-image-upload"
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                          uploadingCover || submitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        <ImageIcon size={20} />
                        {uploadingCover ? 'Uploading...' : 'Upload Cover Image'}
                      </label>
                      {formData.coverImage && (
                        <div className="flex items-center gap-2">
                          <img
                            src={formData.coverImage}
                            alt="Cover preview"
                            className="h-12 w-12 object-cover rounded"
                          />
                          <button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                coverImage: '',
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
                      {formData.gallery.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {formData.gallery.map((url, idx) => (
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testimonial
                    </label>
                    <textarea
                      name="testimonial"
                      value={formData.testimonial}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter testimonial (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Booking URL
                      </label>
                      <input
                        type="url"
                        name="bookingUrl"
                        value={formData.bookingUrl}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube URL
                      </label>
                      <input
                        type="url"
                        name="youtubeUrl"
                        value={formData.youtubeUrl}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        FAQs
                      </label>
                      <button
                        onClick={addFAQ}
                        disabled={submitting}
                        className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                        Add FAQ
                      </button>
                    </div>
                    {formData.faqs.length > 0 && (
                      <div className="space-y-3">
                        {formData.faqs.map((faq, index) => (
                          <div
                            key={index}
                            className="border border-gray-300 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                FAQ {index + 1}
                              </span>
                              <button
                                onClick={() => removeFAQ(index)}
                                disabled={submitting}
                                className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) =>
                                handleFAQChange(index, 'question', e.target.value)
                              }
                              disabled={submitting}
                              className="w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="Question"
                            />
                            <textarea
                              value={faq.answer}
                              onChange={(e) =>
                                handleFAQChange(index, 'answer', e.target.value)
                              }
                              disabled={submitting}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="Answer"
                            />
                          </div>
                        ))}
                      </div>
                    )}
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
                        uploadingCover ||
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
                          {editingId ? 'Update Retreat' : 'Create Retreat'}
                        </>
                      )}
                    </button>
                  </div>

                  {!isFormValid() && (
                    <div className="text-sm text-red-600 text-center">
                      ⚠️ Title, start date, end date, and cover image are
                      required
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

export default RetreatAdminPage