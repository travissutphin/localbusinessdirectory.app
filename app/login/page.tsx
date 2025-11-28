'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { Mail, CheckCircle, AlertCircle, MapPin } from 'lucide-react'
import Link from 'next/link'

type AvailableLocation = {
  id: string
  name: string
  slug: string
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [locationBlocked, setLocationBlocked] = useState(false)
  const [checkingLocation, setCheckingLocation] = useState(true)
  const [availableLocations, setAvailableLocations] = useState<AvailableLocation[]>([])
  const [detectedCity, setDetectedCity] = useState<string | null>(null)

  useEffect(() => {
    checkLocationAccess()
  }, [])

  async function checkLocationAccess() {
    try {
      const response = await fetch('/api/geolocation/detect')
      const data = await response.json()

      if (data.detected && !data.matched) {
        setLocationBlocked(true)
        setDetectedCity(data.geoData?.city || null)
        if (data.availableLocations) {
          setAvailableLocations(data.availableLocations)
        }
      }
    } catch (err) {
      // If geolocation fails, allow access
      console.error('Location check failed:', err)
    } finally {
      setCheckingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('loading')

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      if (result?.error) {
        setError('Failed to send sign-in link. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setStatus('error')
    }
  }

  if (checkingLocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-300">Checking your location...</p>
        </div>
      </div>
    )
  }

  if (locationBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-900/30 rounded-full mb-6">
              <MapPin className="w-8 h-8 text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Not Available in Your Area</h1>
            <p className="text-neutral-300">
              {detectedCity
                ? `We don't have listings for ${detectedCity} yet.`
                : `Your location is not currently in our service area.`
              }
            </p>
          </div>

          <div className="card-dark text-white">
            <p className="text-neutral-300 text-center mb-6">
              Registration and login are only available for users in our service areas.
              Browse our available directories to see where we operate.
            </p>

            {availableLocations.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-neutral-400 text-center">Available Locations:</p>
                {availableLocations.map((loc) => (
                  <Link
                    key={loc.id}
                    href={`/${loc.slug}`}
                    className="flex items-center gap-3 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-primary-400" />
                    <span>{loc.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-neutral-300">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="card-dark text-white">
          {status === 'success' ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/30 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-3">Check your email</h2>
              <p className="text-neutral-300 mb-2">
                We sent a sign-in link to:
              </p>
              <p className="text-white font-medium mb-6">{email}</p>
              <p className="text-neutral-400 text-sm">
                Click the link in the email to sign in.
                <br />The link expires in 24 hours.
              </p>
              <div className="mt-8 pt-6 border-t border-neutral-700">
                <p className="text-neutral-500 text-sm mb-3">Didn&apos;t receive the email?</p>
                <button
                  onClick={() => {
                    setStatus('idle')
                    setEmail('')
                  }}
                  className="text-secondary-400 hover:text-secondary-300 text-sm font-medium"
                >
                  Try again with a different email
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Description */}
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm text-center">
                  No password needed! We&apos;ll send you a secure sign-in link.
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input-dark pl-10"
                      placeholder="you@example.com"
                      disabled={status === 'loading'}
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending link...
                    </span>
                  ) : (
                    'Send Sign-In Link'
                  )}
                </button>
              </form>

              {/* Info */}
              <div className="mt-6 text-center">
                <p className="text-neutral-400 text-sm">
                  New here? Just enter your email and we&apos;ll create your account automatically.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
