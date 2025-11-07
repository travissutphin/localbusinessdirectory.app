import crypto from 'crypto'
import { prisma } from './db'

/**
 * Generate a cryptographically secure verification token for email verification
 * @param email - The email address to generate token for
 * @returns The generated token string
 */
export async function generateVerificationToken(email: string): Promise<string> {
  // Generate a secure random token (32 bytes = 64 hex characters)
  const token = crypto.randomBytes(32).toString('hex')

  // Token expires in 24 hours
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email }
  })

  // Create new token in database
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  })

  return token
}

/**
 * Verify a token and return the associated email if valid
 * @param token - The verification token to check
 * @returns Email address if valid, null if invalid/expired
 */
export async function verifyToken(token: string): Promise<string | null> {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token }
  })

  if (!verificationToken) {
    return null
  }

  // Check if expired
  if (verificationToken.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: { token }
    })
    return null
  }

  return verificationToken.identifier
}

/**
 * Delete a verification token after successful verification
 * @param token - The token to delete
 */
export async function deleteVerificationToken(token: string): Promise<void> {
  await prisma.verificationToken.delete({
    where: { token }
  }).catch(() => {
    // Ignore errors if token doesn't exist
  })
}
