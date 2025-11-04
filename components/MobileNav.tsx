'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Home, Menu, User, Shield, X, Info, FileText, Phone, Building2, LogOut } from 'lucide-react'

type UserType = {
  id: string
  email: string
  name: string | null
  role: string
}

export default function MobileNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Close menu on route change
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

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

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
    },
    {
      icon: Menu,
      label: 'More',
      href: '#',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        setIsMenuOpen(true)
      }
    },
    {
      icon: user?.role === 'ADMIN' ? Shield : User,
      label: user ? (user.role === 'ADMIN' ? 'Admin' : 'Dashboard') : 'Login',
      href: user ? (user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login',
    },
  ]

  const menuItems = [
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

  // Add user-specific menu items
  if (user) {
    if (user.role === 'ADMIN') {
      menuItems.push({
        icon: Shield,
        label: 'Admin Panel',
        href: '/admin',
      })
    }
    menuItems.push({
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
      {/* Mobile Navigation - Fixed Bottom with iOS Safe Area */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-50 safe-area-bottom">
        <div className="grid grid-cols-3 gap-1 px-2 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.href !== '#' && isActive(item.href)

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 min-h-[44px]"
                style={{
                  color: active ? 'var(--color-primary-600)' : 'var(--color-neutral-600)',
                  backgroundColor: active ? 'var(--color-primary-50)' : 'transparent',
                }}
              >
                <Icon
                  className="w-6 h-6 mb-1"
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className="text-xs font-medium"
                  style={{
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {item.label}
                </span>
              </a>
            )
          })}
        </div>
      </nav>

      {/* Slide-up Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-up Menu */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-[61] transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-neutral-300 rounded-full" />
        </div>

        {/* Menu Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="max-h-[60vh] overflow-y-auto pb-safe">
          <ul className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-4 px-6 py-3 transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active ? 'text-primary-600' : 'text-neutral-500'
                      }`}
                    />
                    <span className={active ? 'font-medium' : ''}>{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          {/* User Section */}
          {user && (
            <div className="border-t border-neutral-200 py-4 px-6">
              <div className="mb-3">
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
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="md:hidden h-20" />
    </>
  )
}
