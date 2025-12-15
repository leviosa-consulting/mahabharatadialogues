// admin/testimonials/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  Quote,
  User,
  Briefcase,
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

interface Testimonial {
  id: string
  quote: string
  name: string
  designation: string
}

const TestimonialsAdminPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    quote: '',
    name: '',
    designation: '',
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const data = await response.json()
      setTestimonials(data.data || [])
      setLoading(false)
    } catch (err) {
      alert('Failed to fetch testimonials')
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      quote: '',
      name: '',
      designation: '',
    })
    setEditingId(null)
    setShowModal(false)
  }

  const handleCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      quote: testimonial.quote || '',
      name: testimonial.name || '',
      designation: testimonial.designation || '',
    })
    setEditingId(testimonial.id)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.quote || !formData.name || !formData.designation) {
      alert('All fields are required')
      return
    }

    // Prevent multiple submissions
    if (submitting) {
      return
    }

    setSubmitting(true)

    try {
      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save testimonial')
      }

      alert(
        editingId
          ? 'Testimonial updated successfully!'
          : 'Testimonial created successfully!'
      )
      setShowModal(false)
      resetForm()
      fetchTestimonials()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete testimonial')

      alert('Testimonial deleted successfully!')
      fetchTestimonials()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const isFormValid = () => {
    return (
      formData.quote.trim() !== '' &&
      formData.name.trim() !== '' &&
      formData.designation.trim() !== ''
    )
  }

  return (
    <ProtectedRoute requireAdmin={true}>
        <Navbar currentTab='testimonials'/>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Testimonials Management
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Create, edit, and manage testimonials
                </p>
              </div>

              <button
                onClick={handleCreate}
                className="flex items-center justify-center cursor-pointer gap-2 bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto"
              >
                <Plus size={20} />
                New Testimonial
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Quote size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg">
                No testimonials found. Create your first testimonial!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow rounded-lg flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <Quote size={32} className="text-purple-600 mb-2" />
                      <p className="text-gray-700 text-sm italic line-clamp-4 min-h-[5rem]">
                        "{testimonial.quote}"
                      </p>
                    </div>

                    <div className="space-y-2 mb-4 flex-grow">
                      <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold">
                        <User size={16} className="text-purple-600" />
                        <span>{testimonial.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase size={16} className="text-purple-600" />
                        <span>{testimonial.designation}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
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
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-20 rounded-t-lg">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Testimonial' : 'Create New Testimonial'}
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
                      Quote *
                    </label>
                    <textarea
                      name="quote"
                      value={formData.quote}
                      onChange={handleInputChange}
                      rows={5}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter testimonial quote..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter person's name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation *
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter designation/title"
                    />
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
                      disabled={!isFormValid() || submitting}
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
                          {editingId ? 'Update Testimonial' : 'Create Testimonial'}
                        </>
                      )}
                    </button>
                  </div>

                  {!isFormValid() && (
                    <div className="text-sm text-red-600 text-center">
                      ⚠️ All fields are required
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

export default TestimonialsAdminPage 