// admin/about/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  User,
  Image as ImageIcon,
  Users,
  Linkedin,
  Twitter,
  Instagram,
  Settings,
} from 'lucide-react'
import { uploadToFirebaseStorage } from '@/utils/firebaseStorageUpload'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminNavbar from '@/components/AdminNavbar'

interface SocialLinks {
  linkedin?: string
  twitter?: string
  instagram?: string
}

interface Member {
  id: string
  name: string
  roles: string[]
  description: string
  imageUrl: string
  socialLinks?: SocialLinks
  teamType: 'core' | 'collaborators'
}

interface PageSettings {
  title: string
  subtitle: string
}

const FALLBACK_IMAGE = '/assets/fallbackImg.jpeg'

const AboutAdminPage = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'core' | 'collaborators'>('core')

  const [pageSettings, setPageSettings] = useState<PageSettings>({
    title: 'Mahabharata Dialogues',
    subtitle: 'Think you want to take the story of Mahabharata ahead and see what is left to explore?',
  })

  const [formData, setFormData] = useState({
    name: '',
    roles: [] as string[],
    description: '',
    imageUrl: '',
    teamType: 'core' as 'core' | 'collaborators',
    socialLinks: {
      linkedin: '',
      twitter: '',
      instagram: '',
    },
  })
  const [roleInput, setRoleInput] = useState('')

  useEffect(() => {
    fetchMembers()
    fetchPageSettings()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/about')
      const data = await response.json()
      setMembers(data.data || [])
      setLoading(false)
    } catch (err) {
      alert('Failed to fetch members')
      setLoading(false)
    }
  }

  const fetchPageSettings = async () => {
    try {
      const response = await fetch('/api/about/page-settings')
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
      const response = await fetch('/api/about/page-settings', {
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

  // Split members into core team and collaborators
  const coreTeamMembers = members.filter(
    (member) => member.teamType === 'core'
  )
  const collaboratorMembers = members.filter(
    (member) => member.teamType === 'collaborators'
  )

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSocialLinkChange = (
    platform: 'linkedin' | 'twitter' | 'instagram',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    setUploadingImage(true)
    try {
      const downloadURL = await uploadToFirebaseStorage(file, 'about')
      setFormData((prev) => ({ ...prev, imageUrl: downloadURL }))
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddRole = () => {
    const trimmedRole = roleInput.trim()
    if (trimmedRole && !formData.roles.includes(trimmedRole)) {
      setFormData((prev) => ({
        ...prev,
        roles: [...prev.roles, trimmedRole],
      }))
      setRoleInput('')
    }
  }

  const handleRemoveRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((r) => r !== role),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddRole()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      roles: [],
      description: '',
      imageUrl: '',
      teamType: 'core',
      socialLinks: {
        linkedin: '',
        twitter: '',
        instagram: '',
      },
    })
    setRoleInput('')
    setEditingId(null)
    setShowModal(false)
  }

  const handleCreate = () => {
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      roles: member.roles || [],
      description: member.description || '',
      imageUrl: member.imageUrl || '',
      teamType: member.teamType || 'core',
      socialLinks: {
        linkedin: member.socialLinks?.linkedin || '',
        twitter: member.socialLinks?.twitter || '',
        instagram: member.socialLinks?.instagram || '',
      },
    })
    setEditingId(member.id)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.imageUrl) {
      alert('Name and image are required')
      return
    }

    if (formData.roles.length === 0) {
      alert('Please add at least one role')
      return
    }

    if (submitting) {
      return
    }

    setSubmitting(true)

    try {
      const dataToSubmit = {
        ...formData,
        // Only include social links that have values
        socialLinks: {
          ...(formData.socialLinks.linkedin && {
            linkedin: formData.socialLinks.linkedin,
          }),
          ...(formData.socialLinks.twitter && {
            twitter: formData.socialLinks.twitter,
          }),
          ...(formData.socialLinks.instagram && {
            instagram: formData.socialLinks.instagram,
          }),
        },
      }

      const url = editingId ? `/api/about/${editingId}` : '/api/about'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save member')
      }

      alert(
        editingId
          ? 'Member updated successfully!'
          : 'Member created successfully!'
      )
      setShowModal(false)
      resetForm()
      fetchMembers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const response = await fetch(`/api/about/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete member')

      alert('Member deleted successfully!')
      fetchMembers()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.imageUrl.trim() !== '' &&
      formData.roles.length > 0
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

  const renderMemberCards = (membersList: Member[]) => {
    if (membersList.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-12 text-center col-span-full">
          <Users size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg">
            No {activeTab === 'core' ? 'core team' : 'collaborator'} members
            found.
          </p>
        </div>
      )
    }

    return membersList.map((member) => (
      <div
        key={member.id}
        className="bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow rounded-lg flex flex-col"
      >
        <div className="h-48 bg-gray-200 overflow-hidden flex-shrink-0">
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User size={48} />
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
            {member.name}
          </h3>

          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {member.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {member.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
              {renderDescriptionWithLineBreaks(member.description)}
            </p>
          )}

          {member.socialLinks &&
            (member.socialLinks.linkedin ||
              member.socialLinks.twitter ||
              member.socialLinks.instagram) && (
              <div className="flex gap-2 mb-4">
                {member.socialLinks.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {member.socialLinks.twitter && (
                  <a
                    href={member.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {member.socialLinks.instagram && (
                  <a
                    href={member.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700"
                  >
                    <Instagram size={18} />
                  </a>
                )}
              </div>
            )}

          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => handleEdit(member)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              <Pencil size={16} />
              Edit
            </button>
            <button
              onClick={() => handleDelete(member.id)}
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
      <AdminNavbar currentTab={'about'} />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Team Members Management
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Create, edit, and manage team members
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
                  New Member
                </button>
              </div>
            </div>
          </div>

        

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('core')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'core'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Core Team ({coreTeamMembers.length})
              </button>
              <button
                onClick={() => setActiveTab('collaborators')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'collaborators'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Collaborators ({collaboratorMembers.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading members...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeTab === 'core'
                ? renderMemberCards(coreTeamMembers)
                : renderMemberCards(collaboratorMembers)}
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
                      placeholder="e.g., Mahabharata Dialogues"
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
                      placeholder="e.g., Think you want to take the story of Mahabharata ahead and see what is left to explore?"
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

          {/* Member Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-20 rounded-t-lg">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Member' : 'Add New Member'}
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
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter member name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Type *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="teamType"
                          value="core"
                          checked={formData.teamType === 'core'}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              teamType: e.target.value as 'core' | 'collaborators',
                            }))
                          }
                          disabled={submitting}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">Core Team</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="teamType"
                          value="collaborators"
                          checked={formData.teamType === 'collaborators'}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              teamType: e.target.value as 'core' | 'collaborators',
                            }))
                          }
                          disabled={submitting}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">
                          Collaborators
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roles *
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={roleInput}
                          onChange={(e) => setRoleInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={submitting}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="e.g., Author, Speaker, Stories"
                        />
                        <button
                          onClick={handleAddRole}
                          disabled={!roleInput.trim() || submitting}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                      {formData.roles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.roles.map((role, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                              {role}
                              <button
                                onClick={() => handleRemoveRole(role)}
                                disabled={submitting}
                                className="hover:text-purple-900 disabled:cursor-not-allowed"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        💡 Tip: Press Enter or click Add to add a role
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Image *
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploadingImage || submitting}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                          uploadingImage || submitting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        <ImageIcon size={20} />
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                      </label>
                      {formData.imageUrl && (
                        <div className="flex items-center gap-2">
                          <img
                            src={formData.imageUrl}
                            alt="Profile preview"
                            className="h-12 w-12 object-cover rounded"
                          />
                          <button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                imageUrl: '',
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
                      Description{' '}
                      <span className="text-xs text-gray-500">
                        (Optional - Press Enter for new line)
                      </span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      disabled={submitting}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed whitespace-pre-wrap"
                      placeholder="Enter member description&#10;Press Enter to add a new line"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Tip: Line breaks will be preserved when displayed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Social Links{' '}
                      <span className="text-xs text-gray-500">(Optional)</span>
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Linkedin size={20} className="text-blue-600" />
                        <input
                          type="url"
                          value={formData.socialLinks.linkedin}
                          onChange={(e) =>
                            handleSocialLinkChange('linkedin', e.target.value)
                          }
                          disabled={submitting}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="LinkedIn profile URL"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Twitter size={20} className="text-blue-400" />
                        <input
                          type="url"
                          value={formData.socialLinks.twitter}
                          onChange={(e) =>
                            handleSocialLinkChange('twitter', e.target.value)
                          }
                          disabled={submitting}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="Twitter/X profile URL"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Instagram size={20} className="text-pink-600" />
                        <input
                          type="url"
                          value={formData.socialLinks.instagram}
                          onChange={(e) =>
                            handleSocialLinkChange('instagram', e.target.value)
                          }
                          disabled={submitting}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="Instagram profile URL"
                        />
                      </div>
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
                        !isFormValid() || uploadingImage || submitting
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
                          {editingId ? 'Update Member' : 'Add Member'}
                        </>
                      )}
                    </button>
                  </div>

                  {!isFormValid() && (
                    <div className="text-sm text-red-600 text-center">
                      ⚠️ Please fill all required fields (Name, Image, Roles)
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

export default AboutAdminPage