import crypto from 'crypto'
import { prisma } from './db'

/**
 * Generate a cryptographically secure password reset token
 * @param email - The email address to generate token for
 * @returns The generated token string
 */
export async function generatePasswordResetToken(email: string): Promise<string> {
  // Generate a secure random token (32 bytes = 64 hex characters)
  const token = crypto.randomBytes(32).toString('hex')

  // Token expires in 1 hour (stricter than email verification)
  const expires = new Date(Date.now() + 60 * 60 * 1000)

  // Delete any existing password reset tokens for this email
  await prisma.verificationToken.deleteMany({
    where: {
      identifier: `password-reset:${email}`
    }
  })

  // Create new password reset token in database
  await prisma.verificationToken.create({
    data: {
      identifier: `password-reset:${email}`,
      token,
      expires
    }
  })

  return token
}

/**
 * Verify a password reset token and return the associated email if valid
 * @param token - The password reset token to check
 * @returns Email address if valid, null if invalid/expired
 */
export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  const passwordResetToken = await prisma.verificationToken.findUnique({
    where: { token }
  })

  if (!passwordResetToken) {
    return null
  }

  // Extract email from identifier (format: "password-reset:email@example.com")
  if (!passwordResetToken.identifier.startsWith('password-reset:')) {
    return null
  }

  const email = passwordResetToken.identifier.replace('password-reset:', '')

  // Check if expired
  if (passwordResetToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token }
    })
    return null
  }

  return email
}

/**
 * Delete a password reset token after successful password reset
 * @param token - The token to delete
 */
export async function deletePasswordResetToken(token: string): Promise<void> {
  await prisma.verificationToken.delete({
    where: { token }
  }).catch(() => {
    // Ignore errors if token doesn't exist
  })
}
