'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, CheckCircle, XCircle, Clock, Eye, Mail, Phone, Globe, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Business = {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string | null
  imageUrl: string | null
  hoursJson: any | null
  status: string
  isActive: boolean
  rejectionReason: string | null
  createdAt: string
  location: {
    name: string
    slug: string
  }
  directory: {
    name: string
    slug: string
  }
  owner: {
    name: string | null
    email: string
  }
}

function AdminBusinessesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState(filterParam || 'ALL')
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (filterParam) {
      setFilter(filterParam)
    }
  }, [filterParam])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/')
        return
      }
      const data = await response.json()

      if (data.user.role !== 'ADMIN') {
        router.push('/')
        return
      }

      fetchBusinesses()
    } catch (err) {
      router.push('/')
    }
  }

  async function fetchBusinesses() {
    try {
      const response = await fetch('/api/admin/businesses')
      if (!response.ok) throw new Error('Failed to fetch businesses')

      const data = await response.json()
      setBusinesses(data.businesses || [])
    } catch (err) {
      setError('Failed to load businesses')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(businessId: string) {
    if (!confirm('Are you sure you want to approve this business?')) {
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/approve`, {
        method: 'PUT',
      })

      if (!response.ok) throw new Error('Failed to approve business')

      // Refresh list
      await fetchBusinesses()
      setSelectedBusiness(null)
    } catch (err: any) {
      alert(err.message || 'Failed to approve business. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject(businessId: string) {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      })

      if (!response.ok) throw new Error('Failed to reject business')

      // Refresh list
      await fetchBusinesses()
      setShowRejectModal(false)
      setSelectedBusiness(null)
      setRejectionReason('')
    } catch (err: any) {
      alert(err.message || 'Failed to reject business. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleToggleActive(businessId: string, currentStatus: boolean) {
    const action = currentStatus ? 'deactivate' : 'activate'
    if (!confirm(`Are you sure you want to ${action} this business?`)) {
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/toggle-active`, {
        method: 'PUT',
      })

      if (!response.ok) throw new Error(`Failed to ${action} business`)

      // Refresh list
      await fetchBusinesses()
      setSelectedBusiness(null)
    } catch (err: any) {
      alert(err.message || `Failed to ${action} business. Please try again.`)
    } finally {
      setActionLoading(false)
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

  const filteredBusinesses = businesses.filter(b => {
    if (filter === 'ALL') return true
    return b.status === filter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Business Approval</h1>
            <a
              href="/admin"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-slate-300 font-medium">Filter:</span>
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="ml-auto text-slate-400">
            Showing {filteredBusinesses.length} of {businesses.length}
          </span>
        </div>

        {/* Business List */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 rounded-lg border border-slate-700">
            <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Businesses Found</h3>
            <p className="text-slate-400">No businesses match the selected filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredBusinesses.map(business => (
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
                    <p className="text-xs text-slate-500 mt-1">
                      Owner: {business.owner.name || business.owner.email}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(business.status)}
                    {business.status === 'APPROVED' && (
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        business.isActive
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {business.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-4">
                  {business.description}
                </p>

                {business.status === 'REJECTED' && business.rejectionReason && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-red-400 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-300">{business.rejectionReason}</p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedBusiness(business)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>

                  {business.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(business.id)}
                        disabled={actionLoading}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBusiness(business)
                          setShowRejectModal(true)
                        }}
                        disabled={actionLoading}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}

                  {business.status === 'APPROVED' && (
                    <button
                      onClick={() => handleToggleActive(business.id, business.isActive)}
                      disabled={actionLoading}
                      className={`flex-1 inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        business.isActive
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {business.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Business Detail Modal */}
      {selectedBusiness && !showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedBusiness.name}
                </h2>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedBusiness.status)}
                  {selectedBusiness.status === 'APPROVED' && (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      selectedBusiness.isActive
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {selectedBusiness.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {selectedBusiness.imageUrl && (
              <img
                src={selectedBusiness.imageUrl}
                alt={selectedBusiness.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">Description</h3>
                <p className="text-white">{selectedBusiness.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">Category</h3>
                <p className="text-white">
                  {selectedBusiness.directory.name} in {selectedBusiness.location.name}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </h3>
                <p className="text-white whitespace-pre-line">{selectedBusiness.address}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </h3>
                  <p className="text-white">{selectedBusiness.phone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </h3>
                  <p className="text-white">{selectedBusiness.email}</p>
                </div>
              </div>

              {selectedBusiness.website && (
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-1">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </h3>
                  <a
                    href={selectedBusiness.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {selectedBusiness.website}
                  </a>
                </div>
              )}

              {selectedBusiness.hoursJson && (
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-1">Business Hours</h3>
                  <pre className="text-white text-sm bg-slate-900 p-3 rounded-lg whitespace-pre-line">
                    {typeof selectedBusiness.hoursJson === 'string'
                      ? selectedBusiness.hoursJson
                      : JSON.stringify(selectedBusiness.hoursJson, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-1">Owner</h3>
                <p className="text-white">
                  {selectedBusiness.owner.name || selectedBusiness.owner.email}
                </p>
              </div>

              {selectedBusiness.status === 'REJECTED' && selectedBusiness.rejectionReason && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-400 mb-1">Rejection Reason</h3>
                  <p className="text-red-300">{selectedBusiness.rejectionReason}</p>
                </div>
              )}
            </div>

            {selectedBusiness.status === 'PENDING' && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleApprove(selectedBusiness.id)}
                  disabled={actionLoading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Business
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject Business
                </button>
              </div>
            )}

            {selectedBusiness.status === 'APPROVED' && (
              <div className="mt-6">
                <button
                  onClick={() => handleToggleActive(selectedBusiness.id, selectedBusiness.isActive)}
                  disabled={actionLoading}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedBusiness.isActive
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {selectedBusiness.isActive ? 'Deactivate Business' : 'Activate Business'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Reject Business</h2>

            <p className="text-slate-300 text-sm mb-4">
              Please provide a reason for rejecting <strong>{selectedBusiness.name}</strong>. This will be shown to the business owner.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              placeholder="e.g., Business information is incomplete or does not meet our guidelines..."
              required
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleReject(selectedBusiness.id)}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                }}
                disabled={actionLoading}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminBusinessesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <AdminBusinessesContent />
    </Suspense>
  )
}
