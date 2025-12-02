import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const OLD_DOMAIN = 'myhbb.app'
const NEW_DOMAIN = 'frontdoordirectory.com'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // 301 Redirect from old domain to new domain
  if (hostname === OLD_DOMAIN || hostname === `www.${OLD_DOMAIN}`) {
    const newUrl = new URL(request.url)
    newUrl.hostname = NEW_DOMAIN
    newUrl.protocol = 'https'
    newUrl.port = ''
    return NextResponse.redirect(newUrl.toString(), 301)
  }

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')

    if (origin) {
      try {
        const originUrl = new URL(origin)
        const originHost = originUrl.host

        if (host && originHost !== host) {
          console.warn(`CSRF blocked: origin ${originHost} does not match host ${host}`)
          return NextResponse.json(
            { error: 'Invalid request origin' },
            { status: 403 }
          )
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid request origin' },
          { status: 403 }
        )
      }
    }
  }

  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
