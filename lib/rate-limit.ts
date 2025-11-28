type RateLimitRecord = {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitRecord>()

const CLEANUP_INTERVAL = 60 * 1000
let lastCleanup = Date.now()

function cleanupExpiredRecords() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  lastCleanup = now
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

type RateLimitConfig = {
  windowMs: number
  maxRequests: number
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  register: { windowMs: 60 * 60 * 1000, maxRequests: 5 },
  upload: { windowMs: 60 * 1000, maxRequests: 10 },
  api: { windowMs: 60 * 1000, maxRequests: 100 },
}

export function rateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMIT_CONFIGS = 'api'
): { success: boolean; remaining: number; resetIn: number } {
  cleanupExpiredRecords()

  const config = RATE_LIMIT_CONFIGS[type]
  const key = `${type}:${identifier}`
  const now = Date.now()

  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    }
  }

  if (existing.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: existing.resetTime - now,
    }
  }

  existing.count++
  return {
    success: true,
    remaining: config.maxRequests - existing.count,
    resetIn: existing.resetTime - now,
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

export function createRateLimitResponse(resetIn: number) {
  const resetInSeconds = Math.ceil(resetIn / 1000)
  const resetInMinutes = Math.ceil(resetInSeconds / 60)

  return {
    error: `Too many requests. Please try again in ${resetInMinutes} minute${resetInMinutes > 1 ? 's' : ''}.`,
    retryAfter: resetInSeconds,
  }
}
