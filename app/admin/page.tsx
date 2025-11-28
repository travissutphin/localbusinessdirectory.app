'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Stats = {
  total: number
  pending: number
  approved: number
  rejected: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/') // Not authenticated
        return
      }
      const data = await response.json()

      // Check if user is admin
      if (data.user.role !== 'ADMIN') {
        router.push('/') // Not authorized
        return
      }

      setUser(data.user)
      fetchStats()
    } catch (err) {
      router.push('/')
    }
  }

  async function fetchStats() {
    try {
      const response = await fetch('/api/admin/businesses')
      if (!response.ok) throw new Error('Failed to fetch businesses')

      const data = await response.json()
      const businesses = data.businesses || []

      setStats({
        total: businesses.length,
        pending: businesses.filter((b: any) => b.status === 'PENDING').length,
        approved: businesses.filter((b: any) => b.status === 'APPROVED').length,
        rejected: businesses.filter((b: any) => b.status === 'REJECTED').length,
      })
    } catch (err) {
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

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
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              {user && (
                <p className="mt-1 text-sm text-slate-400">
                  Welcome, {user.name || user.email}
                </p>
              )}
            </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Businesses */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Businesses</p>
                <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Pending Review */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Pending Review</p>
                <p className="mt-2 text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            {stats.pending > 0 && (
              <div className="mt-4">
                <a
                  href="/admin/businesses?filter=PENDING"
                  className="text-xs text-yellow-400 hover:text-yellow-300"
                >
                  Review now →
                </a>
              </div>
            )}
          </div>

          {/* Approved */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Approved</p>
                <p className="mt-2 text-3xl font-bold text-green-400">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Rejected</p>
                <p className="mt-2 text-3xl font-bold text-red-400">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/businesses?filter=PENDING"
              className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-colors"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />
                <span className="text-white font-medium">Review Pending</span>
              </div>
              <span className="text-yellow-400 font-bold">{stats.pending}</span>
            </a>

            <a
              href="/admin/businesses"
              className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-blue-400 mr-3" />
                <span className="text-white font-medium">All Businesses</span>
              </div>
              <span className="text-blue-400 font-bold">{stats.total}</span>
            </a>

            <a
              href="/admin/businesses?filter=APPROVED"
              className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-white font-medium">View Approved</span>
              </div>
              <span className="text-green-400 font-bold">{stats.approved}</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
