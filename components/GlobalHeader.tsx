'use client'

import { Building2 } from 'lucide-react'

export default function GlobalHeader() {
  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 text-xl font-bold transition-colors"
            style={{ color: 'var(--color-primary-600)' }}
          >
            <Building2 className="w-7 h-7" style={{ color: 'var(--color-secondary-500)' }} />
            <span>Local Business Directory</span>
          </a>
        </div>
      </div>
    </header>
  )
}
