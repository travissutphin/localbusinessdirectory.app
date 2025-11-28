import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generatePasswordResetToken } from '@/lib/password-reset'
import { sendPasswordResetEmail } from '@/lib/email'
import { rateLimit, getClientIp, createRateLimitResponse } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req)
    const rateLimitResult = rateLimit(clientIp, 'passwordReset')

    if (!rateLimitResult.success) {
      return NextResponse.json(
        createRateLimitResponse(rateLimitResult.resetIn),
        { status: 429 }
      )
    }

    const body = await req.json()
    const { email } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`)
      return NextResponse.json(
        {
          message: 'If an account exists with this email, you will receive password reset instructions.'
        },
        { status: 200 }
      )
    }

    // Check if user has a password (OAuth users don't)
    if (!user.passwordHash) {
      console.log(`Password reset requested for OAuth user: ${email}`)
      // Still return success to avoid revealing OAuth status
      return NextResponse.json(
        {
          message: 'If an account exists with this email, you will receive password reset instructions.'
        },
        { status: 200 }
      )
    }

    // Generate password reset token
    try {
      console.log('🔑 Generating password reset token for:', email)
      const token = await generatePasswordResetToken(email)
      console.log('🔑 Token generated, attempting to send email...')
      await sendPasswordResetEmail(email, user.name || email, token)
      console.log('✅ Password reset email sent successfully')
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError)
      // Log error but don't reveal to user
      return NextResponse.json(
        {
          message: 'If an account exists with this email, you will receive password reset instructions.'
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        message: 'If an account exists with this email, you will receive password reset instructions.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    )
  }
}
