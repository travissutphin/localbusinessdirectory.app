'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

const OLD_DOMAIN = 'myhbb.app'
const NEW_DOMAIN = 'https://frontdoordirectory.com'
const REDIRECT_DELAY = 5

export default function DomainRedirectPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [countdown, setCountdown] = useState(REDIRECT_DELAY)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      if (hostname === OLD_DOMAIN || hostname === `www.${OLD_DOMAIN}`) {
        setShowPopup(true)
      }
    }
  }, [])

  useEffect(() => {
    if (!showPopup) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          const newUrl = NEW_DOMAIN + window.location.pathname + window.location.search
          window.location.href = newUrl
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showPopup])

  const handleRedirectNow = () => {
    const newUrl = NEW_DOMAIN + window.location.pathname + window.location.search
    window.location.href = newUrl
  }

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            We&apos;ve Moved!
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-8 text-center">
          <p className="text-lg text-neutral-700 mb-2">
            <span className="font-semibold text-neutral-500">myhbb.app</span> is now
          </p>
          <p className="text-2xl font-bold text-primary-600 mb-6">
            FrontDoorDirectory.com
          </p>
          <p className="text-neutral-600 mb-6">
            You will be redirected in <span className="font-bold text-primary-600">{countdown}</span> seconds
          </p>

          {/* Progress bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((REDIRECT_DELAY - countdown) / REDIRECT_DELAY) * 100}%` }}
            />
          </div>

          <button
            onClick={handleRedirectNow}
            className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Go Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
