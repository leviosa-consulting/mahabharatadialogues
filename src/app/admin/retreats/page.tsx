// app/admin/retreats/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  Calendar,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'
import {
  uploadImage,
  deleteFromFirebaseStorage,
} from '@/utils/firebaseStorageUpload'

interface ScheduleItem {
  title: string
  description: string
  time: string
}

interface ScheduleSection {
  type: 'meal' | 'activities'
  title?: string
  time?: string
  items?: ScheduleItem[]
}

interface DaySchedule {
  date: string
  dayName: string
  schedule: ScheduleSection[]
}

interface Retreat {
  id: string
  title: string
  slug?: string
  description?: string
  venue?: string
  youtube_video?: string
  photos?: string[]
  day1: DaySchedule
  day2: DaySchedule
  day3?: DaySchedule
  created_at: string
  updated_at: string
}

const RetreatsAdminPage = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [expandedRetreat, setExpandedRetreat] = useState<string | null>(null)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [isThreeDayRetreat, setIsThreeDayRetreat] = useState(false)

  const [formData, setFormData] = useState<
    Omit<Retreat, 'id' | 'created_at' | 'updated_at'>
  >({
    title: 'Mahabharata Dialogues',
    description: '',
    venue: '',
    youtube_video: '',
    photos: [],
    day1: {
      date: '',
      dayName: '',
      schedule: [],
    },
    day2: {
      date: '',
      dayName: '',
      schedule: [],
    },
    day3: undefined,
  })

  useEffect(() => {
    fetchRetreats()
  }, [])

  const fetchRetreats = async () => {
    try {
      const response = await fetch('/api/retreats')
      const data = await response.json()
      setRetreats(data.data || [])
      setLoading(false)
    } catch (err) {
      alert('Failed to fetch retreats')
      setLoading(false)
    }
  }

  const getDayName = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    return days[date.getDay()]
  }

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const day = date.getDate().toString().padStart(2, '0')
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const resetForm = () => {
    setFormData({
      title: 'Mahabharata Dialogues',
      description: '',
      venue: '',
      youtube_video: '',
      photos: [],
      day1: {
        date: '',
        dayName: '',
        schedule: [],
      },
      day2: {
        date: '',
        dayName: '',
        schedule: [],
      },
      day3: undefined,
    })
    setEditingId(null)
    setShowModal(false)
    setIsThreeDayRetreat(false)
  }

  const handleCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (retreat: Retreat) => {
    setFormData({
      title: retreat.title,
      description: retreat.description || '',
      venue: retreat.venue || '',
      youtube_video: retreat.youtube_video || '',
      photos: retreat.photos || [],
      day1: retreat.day1,
      day2: retreat.day2,
      day3: retreat.day3,
    })
    setIsThreeDayRetreat(!!retreat.day3)
    setEditingId(retreat.id)
    setShowModal(true)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingPhotos(true)
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadImage(file, 'retreats')
      )
      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter(
        (url): url is string => url !== null
      )

      setFormData((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...validUrls],
      }))
    } catch (error) {
      alert('Failed to upload some photos')
    } finally {
      setUploadingPhotos(false)
    }
  }

  const handleRemovePhoto = async (photoUrl: string, index: number) => {
    try {
      await deleteFromFirebaseStorage(photoUrl)
      setFormData((prev) => ({
        ...prev,
        photos: prev.photos?.filter((_, i) => i !== index) || [],
      }))
    } catch (error) {
      alert('Failed to delete photo')
    }
  }

  const toggleThreeDay = () => {
    setIsThreeDayRetreat(!isThreeDayRetreat)
    if (!isThreeDayRetreat) {
      // Enable 3-day mode
      setFormData((prev) => ({
        ...prev,
        day3: {
          date: '',
          dayName: '',
          schedule: [],
        },
      }))
    } else {
      // Disable 3-day mode
      setFormData((prev) => ({
        ...prev,
        day3: undefined,
      }))
    }
  }

  const handleSubmit = async () => {
    if (!formData.day1.date || !formData.day2.date) {
      alert('Day 1 and Day 2 dates are required')
      return
    }

    if (isThreeDayRetreat && !formData.day3?.date) {
      alert('Day 3 date is required for 3-day retreat')
      return
    }

    if (submitting) return

    setSubmitting(true)

    try {
      const submitData: any = {
        title: formData.title,
        description: formData.description || undefined,
        venue: formData.venue || undefined,
        youtube_video: formData.youtube_video || undefined,
        photos:
          formData.photos && formData.photos.length > 0
            ? formData.photos
            : undefined,
        day1: {
          date: formatDisplayDate(formData.day1.date),
          dayName: getDayName(formData.day1.date),
          schedule: formData.day1.schedule,
        },
        day2: {
          date: formatDisplayDate(formData.day2.date),
          dayName: getDayName(formData.day2.date),
          schedule: formData.day2.schedule,
        },
      }

      if (isThreeDayRetreat && formData.day3) {
        submitData.day3 = {
          date: formatDisplayDate(formData.day3.date),
          dayName: getDayName(formData.day3.date),
          schedule: formData.day3.schedule,
        }
      }

      const url = editingId ? `/api/retreats/${editingId}` : '/api/retreats'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
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
      const response = await fetch(`/api/retreats/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete retreat')

      alert('Retreat deleted successfully!')
      fetchRetreats()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const addScheduleSection = (
    day: 'day1' | 'day2' | 'day3',
    type: 'meal' | 'activities'
  ) => {
    const newSection: ScheduleSection =
      type === 'meal'
        ? { type: 'meal', title: '', time: '' }
        : {
            type: 'activities',
            items: [{ title: '', description: '', time: '' }],
          }

    setFormData((prev) => {
      if (day === 'day3') {
        if (!prev.day3) return prev
        return {
          ...prev,
          day3: {
            ...prev.day3,
            schedule: [...prev.day3.schedule, newSection],
          },
        }
      }

      const dayData = prev[day as 'day1' | 'day2']
      return {
        ...prev,
        [day]: {
          ...dayData,
          schedule: [...dayData.schedule, newSection],
        },
      }
    })
  }

  const removeScheduleSection = (
    day: 'day1' | 'day2' | 'day3',
    index: number
  ) => {
    setFormData((prev) => {
      if (day === 'day3') {
        if (!prev.day3) return prev
        return {
          ...prev,
          day3: {
            ...prev.day3,
            schedule: prev.day3.schedule.filter((_, i) => i !== index),
          },
        }
      }

      const dayData = prev[day as 'day1' | 'day2']
      return {
        ...prev,
        [day]: {
          ...dayData,
          schedule: dayData.schedule.filter((_, i) => i !== index),
        },
      }
    })
  }

  const updateScheduleSection = (
    day: 'day1' | 'day2' | 'day3',
    sectionIndex: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => {
      if (day === 'day3') {
        if (!prev.day3) return prev
        return {
          ...prev,
          day3: {
            ...prev.day3,
            schedule: prev.day3.schedule.map((section, i) =>
              i === sectionIndex ? { ...section, [field]: value } : section
            ),
          },
        }
      }

      const dayData = prev[day as 'day1' | 'day2']
      return {
        ...prev,
        [day]: {
          ...dayData,
          schedule: dayData.schedule.map((section, i) =>
            i === sectionIndex ? { ...section, [field]: value } : section
          ),
        },
      }
    })
  }

  const addActivityItem = (
    day: 'day1' | 'day2' | 'day3',
    sectionIndex: number
  ) => {
    setFormData((prev) => {
      if (day === 'day3') {
        if (!prev.day3) return prev
        return {
          ...prev,
          day3: {
            ...prev.day3,
            schedule: prev.day3.schedule.map((section, i) =>
              i === sectionIndex && section.type === 'activities'
                ? {
                    ...section,
                    items: [
                      ...(section.items || []),
                      { title: '', description: '', time: '' },
                    ],
                  }
                : section
            ),
          },
        }
      }

      const dayData = prev[day as 'day1' | 'day2']
      return {
        ...prev,
        [day]: {
          ...dayData,
          schedule: dayData.schedule.map((section, i) =>
            i === sectionIndex && section.type === 'activities'
              ? {
                  ...section,
                  items: [
                    ...(section.items || []),
                    { title: '', description: '', time: '' },
                  ],
                }
              : section
          ),
        },
      }
    })
  }

  const removeActivityItem = (
    day: 'day1' | 'day2' | 'day3',
    sectionIndex: number,
    itemIndex: number
  ) => {
    setFormData((prev) => {
      if (day === 'day3') {
        if (!prev.day3) return prev
        return {
          ...prev,
          day3: {
            ...prev.day3,
            schedule: prev.day3.schedule.map((section, i) =>
              i === sectionIndex && section.type === 'activities'
                ? {
                    ...section,
                    items: section.items?.filter((_, j) => j !== itemIndex),
                  }
                : section
            ),
          },
        }
      }

      const dayData = prev[day as 'day1' | 'day2']
      return {
        ...prev,
        [day]: {
          ...dayData,
          schedule: dayData.schedule.map((section, i) =>
            i === sectionIndex && section.type === 'activities'
              ? {
                  ...section,
                  items: section.items?.filter((_, j) => j !== itemIndex),
                }
              : section
          ),
        },
      }
    })
  }

  const updateActivityItem = (
    day: 'day1' | 'day2' | 'day3',
    sectionIndex: number,
    itemIndex: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      if (day === 'day3') {
        if (!prev.day3) return prev
        return {
          ...prev,
          day3: {
            ...prev.day3,
            schedule: prev.day3.schedule.map((section, i) =>
              i === sectionIndex && section.type === 'activities'
                ? {
                    ...section,
                    items: section.items?.map((item, j) =>
                      j === itemIndex ? { ...item, [field]: value } : item
                    ),
                  }
                : section
            ),
          },
        }
      }

      const dayData = prev[day as 'day1' | 'day2']
      return {
        ...prev,
        [day]: {
          ...dayData,
          schedule: dayData.schedule.map((section, i) =>
            i === sectionIndex && section.type === 'activities'
              ? {
                  ...section,
                  items: section.items?.map((item, j) =>
                    j === itemIndex ? { ...item, [field]: value } : item
                  ),
                }
              : section
          ),
        },
      }
    })
  }

  const handleDateChange = (
    day: 'day1' | 'day2' | 'day3',
    dateValue: string
  ) => {
    setFormData((prev) => {
      if (day === 'day3') {
        if (!prev.day3) return prev
        return {
          ...prev,
          day3: {
            ...prev.day3,
            date: dateValue,
            dayName: getDayName(dateValue),
          },
        }
      }

      const dayData = prev[day as 'day1' | 'day2']
      return {
        ...prev,
        [day]: {
          ...dayData,
          date: dateValue,
          dayName: getDayName(dateValue),
        },
      }
    })
  }

  const renderDayScheduleForm = (
    day: 'day1' | 'day2' | 'day3',
    dayNumber: number
  ) => {
    const dayData =
      day === 'day3' ? formData.day3 : formData[day as 'day1' | 'day2']
    if (!dayData) return null

    return (
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Day {dayNumber} Schedule
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date *
          </label>
          <input
            type="date"
            value={dayData.date}
            onChange={(e) => handleDateChange(day, e.target.value)}
            disabled={submitting}
            className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
          {dayData.date && (
            <p className="mt-2 text-sm text-gray-600">
              Day:{' '}
              <span className="font-medium">{getDayName(dayData.date)}</span>{' '}
              &middot; Formatted:{' '}
              <span className="font-medium">
                {formatDisplayDate(dayData.date)}
              </span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          {dayData.schedule.map((section, sIdx) => (
            <div key={sIdx} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-sm">
                  {section.type === 'meal' ? 'Meal Break' : 'Activities'}
                </span>
                <button
                  onClick={() => removeScheduleSection(day, sIdx)}
                  className="text-red-600 hover:text-red-700"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>

              {section.type === 'meal' ? (
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) =>
                      updateScheduleSection(day, sIdx, 'title', e.target.value)
                    }
                    placeholder="Meal name (e.g., Breakfast)"
                    className="px-3 py-2 border rounded-lg text-sm"
                    disabled={submitting}
                  />
                  <input
                    type="text"
                    value={section.time || ''}
                    onChange={(e) =>
                      updateScheduleSection(day, sIdx, 'time', e.target.value)
                    }
                    placeholder="Time (e.g., 08:45 - 09:30)"
                    className="px-3 py-2 border rounded-lg text-sm"
                    disabled={submitting}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {section.items?.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="grid gap-2 p-3 bg-white rounded border"
                    >
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeActivityItem(day, sIdx, iIdx)}
                          className="text-red-600 hover:text-red-700"
                          type="button"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateActivityItem(
                            day,
                            sIdx,
                            iIdx,
                            'title',
                            e.target.value
                          )
                        }
                        placeholder="Activity title"
                        className="px-3 py-2 border rounded-lg text-sm"
                        disabled={submitting}
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateActivityItem(
                            day,
                            sIdx,
                            iIdx,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder="Description"
                        className="px-3 py-2 border rounded-lg text-sm"
                        disabled={submitting}
                      />
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) =>
                          updateActivityItem(
                            day,
                            sIdx,
                            iIdx,
                            'time',
                            e.target.value
                          )
                        }
                        placeholder="Time"
                        className="px-3 py-2 border rounded-lg text-sm"
                        disabled={submitting}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addActivityItem(day, sIdx)}
                    className="text-sm text-purple-600 hover:text-purple-700"
                    type="button"
                  >
                    + Add Activity
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <button
              onClick={() => addScheduleSection(day, 'meal')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              type="button"
            >
              + Add Meal
            </button>
            <button
              onClick={() => addScheduleSection(day, 'activities')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              type="button"
            >
              + Add Activities
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <Navbar currentTab="retreats" />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Retreats Management
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Create, edit, and manage retreat schedules
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
            <div className="space-y-4">
              {retreats.map((retreat) => (
                <div
                  key={retreat.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {retreat.title}
                        </h3>
                        {retreat.slug && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">
                              Public URL:
                            </p>
                            <div className="flex items-center gap-2">
                              <code className="text-sm text-blue-600 font-mono">
                                /retreats/{retreat.slug}
                              </code>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${window.location.origin}/retreats/${retreat.slug}`
                                  )
                                  alert('URL copied to clipboard!')
                                }}
                                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        )}
                        {retreat.description && (
                          <p className="text-purple-600 font-medium text-sm mt-2">
                            Event: {retreat.description}
                          </p>
                        )}
                        {retreat.venue && (
                          <p className="text-gray-500 text-sm">
                            Venue: {retreat.venue}
                          </p>
                        )}
                        <div className="flex gap-4 mt-3 flex-wrap">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-purple-600" />
                            <span className="font-medium">Day 1:</span>{' '}
                            {retreat.day1.date} ({retreat.day1.dayName})
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={16} className="text-purple-600" />
                            <span className="font-medium">Day 2:</span>{' '}
                            {retreat.day2.date} ({retreat.day2.dayName})
                          </div>
                          {retreat.day3 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar size={16} className="text-purple-600" />
                              <span className="font-medium">Day 3:</span>{' '}
                              {retreat.day3.date} ({retreat.day3.dayName})
                            </div>
                          )}
                        </div>
                        {retreat.photos && retreat.photos.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            <ImageIcon
                              size={16}
                              className="text-gray-500 mt-1"
                            />
                            <span className="text-sm text-gray-600">
                              {retreat.photos.length} photo(s)
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(retreat)}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(retreat.id)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedRetreat(
                          expandedRetreat === retreat.id ? null : retreat.id
                        )
                      }
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      {expandedRetreat === retreat.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                      {expandedRetreat === retreat.id ? 'Hide' : 'Show'} Details
                    </button>

                    {expandedRetreat === retreat.id && (
                      <div className="mt-4 border-t pt-4">
                        {retreat.youtube_video && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              YouTube Video:
                            </p>
                            <a
                              href={retreat.youtube_video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {retreat.youtube_video}
                            </a>
                          </div>
                        )}

                        {retreat.photos && retreat.photos.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Photos:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {retreat.photos.map((photo, idx) => (
                                <img
                                  key={idx}
                                  src={photo}
                                  alt={`Photo ${idx + 1}`}
                                  className="w-full h-32 object-cover rounded"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div
                          className={`grid ${
                            retreat.day3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                          } gap-6`}
                        >
                          <div>
                            <h4 className="font-semibold text-lg mb-3 text-purple-600">
                              Day 1 Schedule
                            </h4>
                            <div className="space-y-2 text-sm">
                              {retreat.day1.schedule.map((section, idx) => (
                                <div
                                  key={idx}
                                  className="border-l-2 border-purple-200 pl-3"
                                >
                                  {section.type === 'meal' ? (
                                    <div className="bg-purple-50 p-2 rounded">
                                      <div className="font-semibold">
                                        {section.title}
                                      </div>
                                      <div className="text-gray-600 text-xs">
                                        {section.time}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      {section.items?.map((item, iIdx) => (
                                        <div key={iIdx} className="py-1">
                                          <div className="font-medium">
                                            {item.title}
                                          </div>
                                          <div className="text-gray-600 text-xs">
                                            {item.description}
                                          </div>
                                          <div className="text-purple-600 text-xs">
                                            {item.time}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg mb-3 text-purple-600">
                              Day 2 Schedule
                            </h4>
                            <div className="space-y-2 text-sm">
                              {retreat.day2.schedule.map((section, idx) => (
                                <div
                                  key={idx}
                                  className="border-l-2 border-purple-200 pl-3"
                                >
                                  {section.type === 'meal' ? (
                                    <div className="bg-purple-50 p-2 rounded">
                                      <div className="font-semibold">
                                        {section.title}
                                      </div>
                                      <div className="text-gray-600 text-xs">
                                        {section.time}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      {section.items?.map((item, iIdx) => (
                                        <div key={iIdx} className="py-1">
                                          <div className="font-medium">
                                            {item.title}
                                          </div>
                                          <div className="text-gray-600 text-xs">
                                            {item.description}
                                          </div>
                                          <div className="text-purple-600 text-xs">
                                            {item.time}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          {retreat.day3 && (
                            <div>
                              <h4 className="font-semibold text-lg mb-3 text-purple-600">
                                Day 3 Schedule
                              </h4>
                              <div className="space-y-2 text-sm">
                                {retreat.day3.schedule.map((section, idx) => (
                                  <div
                                    key={idx}
                                    className="border-l-2 border-purple-200 pl-3"
                                  >
                                    {section.type === 'meal' ? (
                                      <div className="bg-purple-50 p-2 rounded">
                                        <div className="font-semibold">
                                          {section.title}
                                        </div>
                                        <div className="text-gray-600 text-xs">
                                          {section.time}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        {section.items?.map((item, iIdx) => (
                                          <div key={iIdx} className="py-1">
                                            <div className="font-medium">
                                              {item.title}
                                            </div>
                                            <div className="text-gray-600 text-xs">
                                              {item.description}
                                            </div>
                                            <div className="text-purple-600 text-xs">
                                              {item.time}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full my-8 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
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

                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  {/* Optional Fields Section */}
                  <div className="border-b pb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Enter Title"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          disabled={submitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Enter Description"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          disabled={submitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Venue
                        </label>
                        <input
                          type="text"
                          value={formData.venue}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              venue: e.target.value,
                            }))
                          }
                          placeholder="Enter venue location"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          disabled={submitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          YouTube Video URL
                        </label>
                        <input
                          type="url"
                          value={formData.youtube_video}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              youtube_video: e.target.value,
                            }))
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                          disabled={submitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Photos
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors">
                            <Upload size={20} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {uploadingPhotos
                                ? 'Uploading...'
                                : 'Upload Photos'}
                            </span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                              disabled={submitting || uploadingPhotos}
                            />
                          </label>

                          {formData.photos && formData.photos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {formData.photos.map((photo, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={photo}
                                    alt={`Photo ${idx + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() =>
                                      handleRemovePhoto(photo, idx)
                                    }
                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    type="button"
                                    disabled={submitting}
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 3-Day Toggle */}
                      <div className="flex items-center gap-3 pt-4">
                        <input
                          type="checkbox"
                          id="threeDayToggle"
                          checked={isThreeDayRetreat}
                          onChange={toggleThreeDay}
                          disabled={submitting}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                        />
                        <label
                          htmlFor="threeDayToggle"
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          This is a 3-day retreat
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Day 1 */}
                  {renderDayScheduleForm('day1', 1)}

                  {/* Day 2 */}
                  {renderDayScheduleForm('day2', 2)}

                  {/* Day 3 (conditional) */}
                  {isThreeDayRetreat && renderDayScheduleForm('day3', 3)}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 p-6 border-t bg-white">
                  <button
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
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
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default RetreatsAdminPage
