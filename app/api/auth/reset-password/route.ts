import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { verifyPasswordResetToken, deletePasswordResetToken } from '@/lib/password-reset'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = body

    // Validation
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Password validation (min 8 chars, 1 uppercase, 1 number)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with 1 uppercase letter and 1 number' },
        { status: 400 }
      )
    }

    // Verify the token and get the associated email
    const email = await verifyPasswordResetToken(token)

    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset token' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10)

    // Update user's password
    await prisma.user.update({
      where: { email },
      data: { passwordHash }
    })

    // Delete the used token
    await deletePasswordResetToken(token)

    console.log(`✅ Password reset successful for: ${email}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully! You can now sign in with your new password.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred during password reset' },
      { status: 500 }
    )
  }
}
