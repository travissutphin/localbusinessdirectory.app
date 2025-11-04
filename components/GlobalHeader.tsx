'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { User, Shield, LogOut, ChevronDown, Building2 } from 'lucide-react'

type UserType = {
  id: string
  email: string
  name: string | null
  role: string
}

export default function GlobalHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Close user menu on route change
    setIsUserMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isUserMenuOpen])

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (err) {
      // User not authenticated
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      window.location.href = '/'
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const navigationLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Contact', href: '/contact' },
    { label: 'Code of Conduct', href: '/code-of-conduct' },
  ]

  if (loading) {
    return null
  }

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

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {/* Main Navigation Links */}
            {navigationLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? 'var(--color-primary-600)' : 'var(--color-neutral-700)',
                    backgroundColor: active ? 'var(--color-primary-50)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {link.label}
                </a>
              )
            })}

            {/* Divider */}
            <div className="w-px h-6 bg-neutral-300 mx-2" />

            {/* Auth Section */}
            {user ? (
              <>
                {/* Admin Panel Link (Admin Only) */}
                {user.role === 'ADMIN' && (
                  <a
                    href="/admin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: isActive('/admin') ? 'var(--color-secondary-600)' : 'var(--color-neutral-700)',
                      backgroundColor: isActive('/admin') ? 'var(--color-secondary-50)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive('/admin')) {
                        e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive('/admin')) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </a>
                )}

                {/* Dashboard Link */}
                <a
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: isActive('/dashboard') ? 'var(--color-primary-600)' : 'var(--color-neutral-700)',
                    backgroundColor: isActive('/dashboard') ? 'var(--color-primary-50)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('/dashboard')) {
                      e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/dashboard')) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <Building2 className="w-4 h-4" />
                  Dashboard
                </a>

                {/* User Menu Dropdown */}
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: 'var(--color-neutral-700)',
                      backgroundColor: isUserMenuOpen ? 'var(--color-neutral-100)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isUserMenuOpen) {
                        e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isUserMenuOpen) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-neutral-200">
                        <p className="text-sm text-neutral-600">Signed in as</p>
                        <p className="font-medium text-neutral-900 truncate">
                          {user.name || user.email}
                        </p>
                        {user.role === 'ADMIN' && (
                          <span className="inline-flex items-center px-2 py-1 mt-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <a
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: 'var(--color-neutral-700)',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  Sign In
                </a>

                {/* Register Button */}
                <a
                  href="/register"
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                  style={{
                    backgroundColor: 'var(--color-primary-600)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-700)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-600)'
                  }}
                >
                  Create Account
                </a>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
