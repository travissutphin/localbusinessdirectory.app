'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Location = {
  id: string
  name: string
  slug: string
}

type Directory = {
  id: string
  name: string
  slug: string
}

export default function NewBusinessPage() {
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])
  const [directories, setDirectories] = useState<Directory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    locationId: '',
    directoryId: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    hoursJson: '',
    imageUrl: '',
  })

  useEffect(() => {
    checkAuth()
    fetchLocations()
  }, [])

  useEffect(() => {
    if (formData.locationId) {
      // Find location slug from ID
      const location = locations.find(l => l.id === formData.locationId)
      if (location) {
        fetchDirectories(location.slug)
      }
    }
  }, [formData.locationId, locations])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/')
      }
    } catch (err) {
      router.push('/')
    }
  }

  async function fetchLocations() {
    try {
      const response = await fetch('/api/locations')
      if (!response.ok) throw new Error('Failed to fetch locations')
      const data = await response.json()
      setLocations(data.locations || [])
    } catch (err) {
      setError('Failed to load locations')
    }
  }

  async function fetchDirectories(locationSlug: string) {
    try {
      const response = await fetch(`/api/directories?location=${locationSlug}`)
      if (!response.ok) throw new Error('Failed to fetch directories')
      const data = await response.json()
      setDirectories(data.directories || [])
    } catch (err) {
      setError('Failed to load service categories')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create business')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create business. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Find location slug from ID
  const selectedLocation = locations.find(l => l.id === formData.locationId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Add New Business</h1>
            <a
              href="/dashboard"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8">
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Business Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Business Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter business name"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe your business and services"
            />
          </div>

          {/* Location & Directory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="locationId" className="block text-sm font-medium text-slate-300 mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <select
                id="locationId"
                name="locationId"
                required
                value={formData.locationId}
                onChange={(e) => {
                  handleChange(e)
                  setFormData(prev => ({ ...prev, directoryId: '' })) // Reset directory
                }}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="directoryId" className="block text-sm font-medium text-slate-300 mb-2">
                Service Category <span className="text-red-400">*</span>
              </label>
              <select
                id="directoryId"
                name="directoryId"
                required
                value={formData.directoryId}
                onChange={handleChange}
                disabled={!formData.locationId}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select category</option>
                {directories.map(directory => (
                  <option key={directory.id} value={directory.id}>
                    {directory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-2">
              Address <span className="text-red-400">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={2}
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="123 Main St&#10;Saint Augustine, FL 32080"
            />
            <p className="mt-1 text-xs text-slate-400">You can use multiple lines for street, city, state, ZIP</p>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="(904) 555-0100"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="business@example.com"
              />
            </div>
          </div>

          {/* Website */}
          <div className="mb-6">
            <label htmlFor="website" className="block text-sm font-medium text-slate-300 mb-2">
              Website (Optional)
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://www.yourbusiness.com"
            />
          </div>

          {/* Business Hours */}
          <div className="mb-6">
            <label htmlFor="hoursJson" className="block text-sm font-medium text-slate-300 mb-2">
              Business Hours (Optional)
            </label>
            <textarea
              id="hoursJson"
              name="hoursJson"
              rows={4}
              value={formData.hoursJson}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Mon-Fri: 9:00 AM - 5:00 PM&#10;Sat: 10:00 AM - 2:00 PM&#10;Sun: Closed"
            />
            <p className="mt-1 text-xs text-slate-400">Enter your business hours in plain text format</p>
          </div>

          {/* Image URL */}
          <div className="mb-8">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-2">
              Business Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-xs text-slate-400">Enter a direct image URL (JPG, PNG)</p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
            <a
              href="/dashboard"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </a>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Your business will be submitted for admin approval. You&apos;ll be notified once it&apos;s reviewed.
          </p>
        </form>
      </main>
    </div>
  )
}
