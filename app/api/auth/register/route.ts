import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { generateVerificationToken } from "@/lib/verification"
import { sendVerificationEmail } from "@/lib/email"
import { rateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req)
    const rateLimitResult = rateLimit(clientIp, 'register')

    if (!rateLimitResult.success) {
      return NextResponse.json(
        createRateLimitResponse(rateLimitResult.resetIn),
        { status: 429 }
      )
    }

    const body = await req.json()
    const { email, password, name } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Password validation (min 8 chars, 1 uppercase, 1 number)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters with 1 uppercase letter and 1 number" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        role: "OWNER",
        authProvider: "email",
        emailVerified: null, // Will be verified via email link
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    })

    // Generate verification token and send email
    try {
      console.log('📧 Generating verification token for:', email)
      const token = await generateVerificationToken(email)
      console.log('📧 Token generated, attempting to send email...')
      await sendVerificationEmail(email, name || email, token)
      console.log('📧 Email sending completed')
    } catch (emailError) {
      console.error("❌ Failed to send verification email:", emailError)
      console.error("❌ Full error details:", JSON.stringify(emailError, null, 2))
      // User is created, but email failed - log error but don't fail registration
    }

    return NextResponse.json(
      {
        message: "Registration successful! Please check your email to verify your account.",
        user
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
