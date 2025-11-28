'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Plus, Edit, Trash2, Clock, CheckCircle, XCircle, Search, ExternalLink, Globe, Share2, Image as ImageIcon, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Business = {
  id: string
  name: string
  description: string
  status: string
  rejectionReason: string | null
  location: {
    name: string
    slug: string
  }
  directory: {
    name: string
    slug: string
  }
  createdAt: string
}

export default function OwnerDashboard() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/') // Not authenticated, redirect to home
        return
      }
      const data = await response.json()
      setUser(data.user)
      fetchBusinesses()
    } catch (err) {
      router.push('/')
    }
  }

  async function fetchBusinesses() {
    try {
      const response = await fetch('/api/businesses')
      if (!response.ok) throw new Error('Failed to fetch businesses')
      const data = await response.json()
      setBusinesses(data.businesses || [])
    } catch (err) {
      setError('Failed to load your businesses')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/businesses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete business')

      setBusinesses(businesses.filter(b => b.id !== id))
    } catch (err) {
      alert('Failed to delete business. Please try again.')
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const canAddBusiness = businesses.length < 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              {user && (
                <p className="mt-1 text-sm text-slate-400">
                  Welcome back, {user.name || user.email}
                  {user.role === 'ADMIN' && (
                    <span className="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-medium rounded border border-orange-500/30">
                      ADMIN
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Add Business Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-slate-300">
              You have <strong className="text-white">{businesses.length} of 2</strong> businesses
            </p>
          </div>
          {canAddBusiness ? (
            <a
              href="/dashboard/businesses/new"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-orange-500/30"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Business
            </a>
          ) : (
            <div className="text-sm text-slate-400">
              Maximum of 2 businesses reached
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {businesses.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 rounded-lg border border-slate-700">
            <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Businesses Yet</h3>
            <p className="text-slate-400 mb-6">Get started by adding your first business listing</p>
            <a
              href="/dashboard/businesses/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Business
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {business.name}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {business.directory.name} • {business.location.name}
                    </p>
                  </div>
                  {getStatusBadge(business.status)}
                </div>

                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {business.description}
                </p>

                {business.status === 'REJECTED' && business.rejectionReason && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-red-400 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-300">{business.rejectionReason}</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <a
                    href={`/dashboard/businesses/${business.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(business.id, business.name)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>

                {business.status === 'APPROVED' && (
                  <div className="mt-3">
                    <a
                      href={`/${business.location.slug}/${business.directory.slug}/${business.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      View Public Listing →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SEO & Visibility Section */}
        <section className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-slate-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Your Online Visibility</h2>
                <p className="text-sm text-slate-400">How customers find your business</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-slate-300 mb-6">
              Your business listings are optimized for search engines like Google and AI assistants. The more complete your profile, the better your chances of being discovered by local customers.
            </p>

            {/* Profile Completeness Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4 text-orange-400" />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">Description & Hours</h3>
                <p className="text-xs text-slate-400">Tell customers what you do and when you&apos;re available</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Globe className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">Website Link</h3>
                <p className="text-xs text-slate-400">Connect your website for more credibility</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                  <Share2 className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">Social Media</h3>
                <p className="text-xs text-slate-400">Link your Facebook, Instagram, and more</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-white mb-1">Business Photo</h3>
                <p className="text-xs text-slate-400">Add a photo to stand out in search results</p>
              </div>
            </div>

            {/* Validation Tools */}
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-medium text-white mb-2">Verify Your Listing</h3>
              <p className="text-xs text-slate-400 mb-3">
                Use these free tools to see how search engines view your business listing:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://search.google.com/test/rich-results"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sm text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2 text-slate-400" />
                  Google Rich Results Test
                </a>
                <a
                  href="https://validator.schema.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sm text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2 text-slate-400" />
                  Schema Validator
                </a>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Copy your public listing URL and paste it into these tools to see your business data.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
