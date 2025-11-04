'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Info, Shield, Phone, FileText, LogOut, User, Building2 } from 'lucide-react'

type User = {
  id: string
  email: string
  name: string | null
  role: string
}

export default function DesktopNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Close menu on route change
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

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

  const navigationItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
    },
    {
      icon: Info,
      label: 'About',
      href: '/about',
    },
    {
      icon: FileText,
      label: 'Privacy Policy',
      href: '/privacy',
    },
    {
      icon: Phone,
      label: 'Contact',
      href: '/contact',
    },
    {
      icon: FileText,
      label: 'Code of Conduct',
      href: '/code-of-conduct',
    },
  ]

  // Add dynamic user links
  if (user) {
    if (user.role === 'ADMIN') {
      navigationItems.push({
        icon: Shield,
        label: 'Admin Panel',
        href: '/admin',
      })
    }
    navigationItems.push({
      icon: Building2,
      label: 'Dashboard',
      href: '/dashboard',
    })
  }

  if (loading) {
    return null
  }

  return (
    <>
      {/* Desktop Only - Hidden on mobile/tablet */}
      <div className="hidden lg:block fixed top-6 left-6 z-50">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 bg-white/90 backdrop-blur-md rounded-lg shadow-lg hover:bg-white transition-colors"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
        >
          <Menu className="w-6 h-6 text-neutral-800" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="hidden lg:block fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slideout Menu */}
      <nav
        className={`hidden lg:block fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900">Navigation</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6 text-neutral-600" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-primary/10 text-primary-600 font-medium'
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          active ? 'text-primary-600' : 'text-neutral-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Footer with Auth Actions */}
          <div className="border-t border-neutral-200 p-6">
            {user ? (
              <div className="space-y-3">
                <div className="px-4 py-2 bg-neutral-50 rounded-lg">
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
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <a
                  href="/login"
                  className="block w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-center font-medium rounded-lg transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="block w-full px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-center font-medium rounded-lg transition-colors"
                >
                  Create Account
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}