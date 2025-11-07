import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, deleteVerificationToken } from '@/lib/verification'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Verify the token and get the associated email
    const email = await verifyToken(token)

    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
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

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: true,
          message: 'Email already verified',
          alreadyVerified: true
        },
        { status: 200 }
      )
    }

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    })

    // Delete the used token
    await deleteVerificationToken(token)

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! You can now sign in.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during email verification' },
      { status: 500 }
    )
  }
}
