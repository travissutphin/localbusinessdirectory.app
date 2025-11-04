'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Home, Search, User, Menu, Shield } from 'lucide-react'

type User = {
  id: string
  email: string
  name: string | null
  role: string
}

export default function MobileNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

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
      icon: Search,
      label: 'Browse',
      href: '/browse',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        const savedLocation = localStorage.getItem('selectedLocation')
        if (savedLocation) {
          window.location.href = `/${savedLocation}`
        } else {
          window.location.href = '/'
        }
      }
    },
    {
      icon: user?.role === 'ADMIN' ? Shield : User,
      label: user ? (user.role === 'ADMIN' ? 'Admin' : 'Dashboard') : 'Login',
      href: user ? (user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login',
    },
    {
      icon: Menu,
      label: 'More',
      href: '/about',
    },
  ]

  if (loading) {
    return null
  }

  return (
    <>
      {/* Mobile Navigation - Fixed Bottom with iOS Safe Area */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-50 safe-area-bottom">
        <div className="grid grid-cols-4 gap-1 px-2 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <a
                key={item.href}
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

      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="md:hidden h-20" />
    </>
  )
}
