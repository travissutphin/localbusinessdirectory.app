'use client'

import { Share2 } from 'lucide-react'

export default function ShareButton({ businessName }: { businessName: string }) {
  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: businessName,
          url: url
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
      } catch (err) {
        // Fallback
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center justify-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors text-sm"
    >
      <Share2 className="w-4 h-4 mr-2" />
      Share This Business
    </button>
  )
}
