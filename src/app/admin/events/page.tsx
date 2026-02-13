
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
  Link,
  MessageSquare,
  Youtube,
  MapPin,
  Settings,
} from 'lucide-react'
import { uploadToFirebaseStorage } from '@/utils/firebaseStorageUpload'
import { generateFullSlug } from '@/utils/slugUtils'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminNavbar from '@/components/AdminNavbar'

interface Event {
  id: string
  title: string
  description: string
  coverImage?: string
  gallery?: string[]
  testimonial?: string
  bookingUrl?: string
  youtubeUrl?: string
  eventDate: string
  slug: string
  venue: string
  city: string
  mapUrl?: string
}

interface PageSettings {
  title: string
  subtitle: string
}

const FALLBACK_IMAGE = '/assets/fallbackImg.jpeg'

const EventsAdminPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  
  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: 'Events',
    subtitle: 'Discover our upcoming events and relive the memories from past gatherings',
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    gallery: [] as string[],
    testimonial: '',
    bookingUrl: '',
    youtubeUrl: '',
    eventDate: '',
    slug: '',
    venue: '',
    city: '',
    mapUrl: '',
  })

  useEffect(() => {
    fetchEvents()
    fetchPageSettings()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      const sortedEvents = (data.data || []).sort((a: Event, b: Event) => {
        const dateA = new Date(a.eventDate).getTime()
        const dateB = new Date(b.eventDate).getTime()
        return dateA - dateB
      })
      setEvents(sortedEvents)
      setLoading(false)
    } catch (err) {
      alert('Failed to fetch events')
      setLoading(false)
    }
  }

  const fetchPageSettings = async () => {
    try {
      const response = await fetch('/api/events/page-settings')
      const data = await response.json()
      if (data.success) {
        setPageSettings(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch page settings:', err)
    }
  }

  const handleSavePageSettings = async () => {
    if (!pageSettings.title.trim() || !pageSettings.subtitle.trim()) {
      alert('Title and subtitle are required')
      return
    }

    setSavingSettings(true)
    try {
      const response = await fetch('/api/events/page-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageSettings),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save settings')
      }

      alert('Page settings updated successfully!')
      setShowSettingsModal(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSavingSettings(false)
    }
  }

  // Split events into upcoming and past
  const now = new Date()
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDate) >= now
  )
  const pastEvents = events.filter((event) => new Date(event.eventDate) < now)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }

      if (name === 'title') {
        updated.slug = generateFullSlug(value)
      }

      return updated
    })
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
      const downloadURL = await uploadToFirebaseStorage(file, 'events')
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
        uploadToFirebaseStorage(file, 'events')
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      coverImage: '',
      gallery: [],
      testimonial: '',
      bookingUrl: '',
      youtubeUrl: '',
      eventDate: '',
      slug: '',
      venue: '',
      city: '',
      mapUrl: '',
    })
    setEditingId(null)
    setShowModal(false)
  }

  const handleCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      coverImage: event.coverImage || '',
      gallery: event.gallery || [],
      testimonial: event.testimonial || '',
      bookingUrl: event.bookingUrl || '',
      youtubeUrl: event.youtubeUrl || '',
      eventDate: event.eventDate || '',
      slug: event.slug || '',
      venue: event.venue || '',
      city: event.city || '',
      mapUrl: event.mapUrl || '',
    })
    setEditingId(event.id)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.eventDate ||
      !formData.venue ||
      !formData.city
    ) {
      alert('Title, description, event date, venue and city are required')
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
        coverImage: formData.coverImage || FALLBACK_IMAGE,
      }

      const url = editingId ? `/api/events/${editingId}` : '/api/events'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save event')
      }

      alert(
        editingId
          ? 'Event updated successfully!'
          : 'Event created successfully!'
      )
      setShowModal(false)
      resetForm()
      fetchEvents()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete event')

      alert('Event deleted successfully!')
      fetchEvents()
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
      formData.description.trim() !== '' &&
      formData.eventDate !== '' &&
      formData.slug.trim() !== '' &&
      formData.venue.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.mapUrl.trim() !== ''
    )
  }

  const renderDescriptionWithLineBreaks = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ))
  }

  const renderEventCards = (eventsList: Event[]) => {
    if (eventsList.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-12 text-center col-span-full">
          <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg">
            No {activeTab} events found.
          </p>
        </div>
      )
    }

    return eventsList.map((event) => (
      <div
        key={event.id}
        className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow rounded-lg flex flex-col"
      >
        <div className="h-48 bg-gray-200 overflow-hidden flex-shrink-0">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
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
            {event.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3 min-h-[3.75rem]">
            {renderDescriptionWithLineBreaks(event.description)}
          </p>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar size={14} />
              <span>{formatDate(event.eventDate)}</span>
            </div>
            {event.venue && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={14} />
                <span className="line-clamp-1">{event.venue}</span>
              </div>
            )}
            {event.city && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={14} />
                <span className="line-clamp-1">{event.city}</span>
              </div>
            )}
            {event.mapUrl && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={14} />
                <span className="line-clamp-1">{event.mapUrl}</span>
              </div>
            )}
            {event.slug && (
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <span className="truncate">/{event.slug}</span>
              </div>
            )}
          </div>

          <div className="space-y-1 mb-4 flex-grow">
            {event.gallery && event.gallery.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ImageIcon size={14} />
                <span>{event.gallery.length} gallery image(s)</span>
              </div>
            )}
            {event.youtubeUrl && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Youtube size={14} />
                <span>YouTube video attached</span>
              </div>
            )}
            {event.bookingUrl && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Link size={14} />
                <span>Booking link available</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => handleEdit(event)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={() => handleDelete(event.id)}
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
      <AdminNavbar currentTab={'events'} />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Events Management
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Create, edit, and manage your events
                </p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors flex-1 sm:flex-initial"
                >
                  <Settings size={20} />
                  Page Settings
                </button>
                <button
                  onClick={handleCreate}
                  className="flex items-center justify-center cursor-pointer gap-2 bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors flex-1 sm:flex-initial"
                >
                  <Plus size={20} />
                  New Event
                </button>
              </div>
            </div>
          </div>

       

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Upcoming Events ({upcomingEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Past Events ({pastEvents.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeTab === 'upcoming'
                ? renderEventCards(upcomingEvents)
                : renderEventCards(pastEvents)}
            </div>
          )}

          {/* Page Settings Modal */}
          {showSettingsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Page Settings
                  </h2>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={savingSettings}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Title *
                    </label>
                    <input
                      type="text"
                      value={pageSettings.title}
                      onChange={(e) =>
                        setPageSettings((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      disabled={savingSettings}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="e.g., Events"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Subtitle *
                    </label>
                    <textarea
                      value={pageSettings.subtitle}
                      onChange={(e) =>
                        setPageSettings((prev) => ({
                          ...prev,
                          subtitle: e.target.value,
                        }))
                      }
                      rows={3}
                      disabled={savingSettings}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="e.g., Discover our upcoming events and relive the memories from past gatherings"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowSettingsModal(false)}
                      disabled={savingSettings}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePageSettings}
                      disabled={
                        savingSettings ||
                        !pageSettings.title.trim() ||
                        !pageSettings.subtitle.trim()
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingSettings ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Event Modal - Keep existing modal code */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-20 rounded-t-lg">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Event' : 'Create New Event'}
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
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *{' '}
                      <span className="text-xs text-gray-500">
                        (Auto-generated from title)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
                      placeholder="event-slug-here-AB12345678"
                    />
                    {formData.slug && (
                      <p className="text-xs text-gray-500 mt-1">
                        URL will be: /events/{formData.slug}
                      </p>
                    )}
                    {editingId && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ Updating the slug will change the event URL. Make
                        sure to update any existing links.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue *
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="e.g., Fireflies, Kanakpura Road"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="e.g., Bengaluru"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Map URL *
                    </label>
                    <input
                      type="text"
                      name="mapUrl"
                      value={formData.mapUrl}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="e.g., https://maps.app.goo.gl/4Egj4DinYnHSuWzU9"
                    />
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
                      placeholder="Enter event description&#10;Press Enter to add a new line&#10;Multiple paragraphs are supported"
                      style={{ fontFamily: 'inherit' }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Tip: Line breaks will be preserved when displayed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image{' '}
                      <span className="text-xs text-gray-500">
                        (Optional - fallback image will be used if not uploaded)
                      </span>
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
                    {!formData.coverImage && (
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
                          {editingId ? 'Update Event' : 'Create Event'}
                        </>
                      )}
                    </button>
                  </div>

                  {!isFormValid() && (
                    <div className="text-sm text-red-600 text-center">
                      {!formData.title && !formData.description && !formData.venue && !formData.eventDate
                        ? '⚠️ Title, Description, Venue and Date are required to create event'
                        : '⚠️ Please fill all required fields (Title, Slug, Venue, Description, Date, City, Map URL)'}
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

export default EventsAdminPage