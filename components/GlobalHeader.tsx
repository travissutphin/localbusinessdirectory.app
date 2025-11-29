'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { Menu, X, Home, Shield, Phone, LogOut, Building2 as Building, UserPlus, LogIn, ChevronDown, MapPin, User as UserIcon, Info, FolderOpen } from 'lucide-react'

type User = {
  id: string
  email: string
  name: string | null
  role: string
}

export default function GlobalHeader() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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
      await signOut({
        redirect: true,
        callbackUrl: '/'
      })
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
      icon: Phone,
      label: 'Contact',
      href: '/contact',
    },
  ]

  // Add user-specific menu items
  if (user) {
    navigationItems.push({
      icon: Building,
      label: 'Dashboard',
      href: '/dashboard',
    })
  }

  if (loading) {
    return null
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/logo-myhbb.png"
                alt="My Home Based Business - myhbb.app"
                width={216}
                height={58}
                priority
                className="h-12 w-auto"
              />
            </a>

            {/* Navigation Buttons + Hamburger Menu */}
            <div className="flex items-center gap-3">
              {/* Browse Directories Button */}
              <a
                href="/directories"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                <MapPin className="w-4 h-4" />
                <span>Browse Directories</span>
              </a>

              {/* My Profile Button - Only for logged-in users */}
              {user && (
                <a
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium bg-primary-600 text-white hover:bg-primary-700"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Profile</span>
                </a>
              )}

              {/* Business Owner Dropdown - Only for non-logged-in users */}
              {!user && (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium bg-primary-600 text-white hover:bg-primary-700"
                  >
                    <Building className="w-4 h-4" />
                    <span>Business Owner</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50">
                      <a
                        href="/login"
                        className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Log In</span>
                      </a>
                      <a
                        href="/register"
                        className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Register</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="p-3 bg-white/90 backdrop-blur-md rounded-lg shadow-lg hover:bg-white transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
              >
                <Menu className="w-6 h-6" style={{ color: 'var(--color-secondary-500)' }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 z-50 safe-top">
        <div className="flex items-center justify-center h-14 px-4">
          <a
            href="/"
            className="flex items-center transition-opacity active:opacity-70"
          >
            <Image
              src="/images/logo-myhbb.png"
              alt="My Home Based Business - myhbb.app"
              width={168}
              height={44}
              priority
              className="h-10 w-auto"
            />
          </a>
        </div>
      </header>

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
        className={`hidden lg:block fixed top-0 right-0 h-full bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '35%' }}
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
                {user.role === 'ADMIN' && (
                  <a
                    href="/admin"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin Panel</span>
                  </a>
                )}
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

            {/* Built By Credit */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <p className="text-center text-sm text-neutral-500">
                Built and Maintained by{' '}
                <a
                  href="https://travissutphin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  travissutphin.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
