'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [alreadyVerified, setAlreadyVerified] = useState(false)

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus('error')
        setMessage('Verification token is missing')
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
          setAlreadyVerified(data.alreadyVerified || false)

          // Redirect to login after 3 seconds
          setTimeout(() => {
            window.location.href = '/login'
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('An error occurred during verification')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {status === 'loading' && (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-4" style={{ color: 'var(--color-neutral-900)' }}>
          {status === 'loading' && 'Verifying Your Email...'}
          {status === 'success' && (alreadyVerified ? 'Already Verified!' : 'Email Verified!')}
          {status === 'error' && 'Verification Failed'}
        </h1>

        {/* Message */}
        <p className="text-center mb-6" style={{ color: 'var(--color-neutral-600)' }}>
          {message}
        </p>

        {/* Loading Progress */}
        {status === 'loading' && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        )}

        {/* Actions */}
        {status === 'success' && (
          <div className="space-y-3">
            <p className="text-sm text-center" style={{ color: 'var(--color-neutral-500)' }}>
              Redirecting to login page in 3 seconds...
            </p>
            <a
              href="/login"
              className="block w-full text-center px-6 py-3 rounded-lg transition-colors font-medium"
              style={{
                backgroundColor: 'var(--color-primary-600)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-700)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-600)'
              }}
            >
              Go to Login Now
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-3">
            <a
              href="/register"
              className="block w-full text-center px-6 py-3 rounded-lg transition-colors font-medium"
              style={{
                backgroundColor: 'var(--color-primary-600)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-700)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-600)'
              }}
            >
              Register Again
            </a>
            <a
              href="/"
              className="block w-full text-center px-6 py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--color-neutral-100)',
                color: 'var(--color-neutral-700)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'
              }}
            >
              Back to Home
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
