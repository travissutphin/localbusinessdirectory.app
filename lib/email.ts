import { createEmailService, EmailService } from './email-factory'
import {
  getBusinessApprovedEmailHtml,
  getBusinessApprovedEmailText,
  getBusinessPendingEmailHtml,
  getBusinessPendingEmailText,
  getBusinessRejectedEmailHtml,
  getBusinessRejectedEmailText
} from './email-templates'

let emailService: EmailService | null = null

/**
 * Get or create email service instance (lazy initialization)
 */
function getEmailService(): EmailService {
  if (!emailService) {
    emailService = createEmailService()
  }
  return emailService
}

/**
 * Send a verification email to a new user
 * @param email - User's email address
 * @param name - User's name
 * @param token - Verification token
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  try {
    console.log('🔄 Attempting to send email to:', email)

    const response = await getEmailService().send({
      from: 'My Home Based Business - myhbb.app <info@myhbb.app>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #003d82 0%, #0056b3 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                  Welcome to My Home Based Business - myhbb.app!
                </h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Hi <strong>${name}</strong>,
                </p>

                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Thank you for registering with My Home Based Business - myhbb.app! We're excited to have you join our community of local business owners.
                </p>

                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                  Please verify your email address by clicking the button below:
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}"
                     style="display: inline-block; background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);">
                    Verify Email Address
                  </a>
                </div>

                <p style="color: #777777; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="color: #003d82; font-size: 14px; line-height: 1.6; margin: 10px 0 30px 0; word-break: break-all;">
                  ${verificationUrl}
                </p>

                <div style="background-color: #f8f9fa; border-left: 4px solid #e67e22; padding: 15px; margin-top: 30px; border-radius: 4px;">
                  <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0;">
                    <strong>Note:</strong> This verification link expires in 24 hours. If you didn't create this account, you can safely ignore this email.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0;">
                  © 2025 My Home Based Business - myhbb.app. All rights reserved.
                </p>
                <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 10px 0 0 0;">
                  Saint Augustine, FL • Connecting Local Communities
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome to My Home Based Business - myhbb.app!

Hi ${name},

Thank you for registering with My Home Based Business - myhbb.app! We're excited to have you join our community of local business owners.

Please verify your email address by clicking the link below:

${verificationUrl}

This verification link expires in 24 hours. If you didn't create this account, you can safely ignore this email.

© 2025 My Home Based Business - myhbb.app. All rights reserved.
Saint Augustine, FL • Connecting Local Communities
      `.trim()
    })

    // Check if email service returned an error
    if (response.error) {
      console.error('❌ Email service returned an error:', response.error)
      throw new Error(`Email sending error: ${response.error.message || JSON.stringify(response.error)}`)
    }

    console.log('✅ Email sent successfully. Message ID:', response.id)
  } catch (error) {
    console.error('❌ Failed to send verification email:', error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
    throw new Error('Failed to send verification email')
  }
}

/**
 * Send a welcome email after successful email verification
 * @param email - User's email address
 * @param name - User's name
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  try {
    console.log('🔄 Sending welcome email to:', email)

    const response = await getEmailService().send({
      from: 'My Home Based Business - myhbb.app <info@myhbb.app>',
      to: email,
      subject: 'Welcome to My Home Based Business - myhbb.app!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome!</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #003d82 0%, #0056b3 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                  🎉 Welcome Aboard, ${name}!
                </h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Hi <strong>${name}</strong>,
                </p>

                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Your email has been successfully verified! You're now ready to explore everything My Home Based Business - myhbb.app has to offer.
                </p>

                <h2 style="color: #003d82; font-size: 20px; margin: 30px 0 15px 0;">What's Next?</h2>

                <ul style="color: #555555; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                  <li>Complete your business profile</li>
                  <li>Browse local directories in your area</li>
                  <li>Connect with other local business owners</li>
                  <li>List your business to reach more customers</li>
                </ul>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                     style="display: inline-block; background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);">
                    Go to Dashboard
                  </a>
                </div>

                <div style="background-color: #f8f9fa; border-left: 4px solid #003d82; padding: 15px; margin-top: 30px; border-radius: 4px;">
                  <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0;">
                    <strong>Need Help?</strong> Our support team is here to help you get started. Feel free to reach out anytime!
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0;">
                  © 2025 My Home Based Business - myhbb.app. All rights reserved.
                </p>
                <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 10px 0 0 0;">
                  Saint Augustine, FL • Connecting Local Communities
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome to My Home Based Business - myhbb.app!

Hi ${name},

Your email has been successfully verified! You're now ready to explore everything My Home Based Business - myhbb.app has to offer.

What's Next?
- Complete your business profile
- Browse local directories in your area
- Connect with other local business owners
- List your business to reach more customers

Visit your dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Need Help? Our support team is here to help you get started. Feel free to reach out anytime!

© 2025 My Home Based Business - myhbb.app. All rights reserved.
Saint Augustine, FL • Connecting Local Communities
      `.trim()
    })

    if (response.error) {
      console.error('❌ Email service returned an error:', response.error)
      throw new Error(`Email sending error: ${response.error.message || JSON.stringify(response.error)}`)
    }

    console.log('✅ Welcome email sent successfully. Message ID:', response.id)
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error)
    // Don't throw - welcome email is nice-to-have, not critical
  }
}

/**
 * Send a password reset email
 * @param email - User's email address
 * @param name - User's name
 * @param token - Password reset token
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  try {
    console.log('🔄 Sending password reset email to:', email)

    const response = await getEmailService().send({
      from: 'My Home Based Business - myhbb.app <info@myhbb.app>',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #003d82 0%, #0056b3 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                  Password Reset Request
                </h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Hi <strong>${name}</strong>,
                </p>

                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  We received a request to reset your password for your My Home Based Business - myhbb.app account.
                </p>

                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                  Click the button below to reset your password:
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}"
                     style="display: inline-block; background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3);">
                    Reset Password
                  </a>
                </div>

                <p style="color: #777777; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="color: #003d82; font-size: 14px; line-height: 1.6; margin: 10px 0 30px 0; word-break: break-all;">
                  ${resetUrl}
                </p>

                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 30px; border-radius: 4px;">
                  <p style="color: #856404; font-size: 13px; line-height: 1.5; margin: 0;">
                    <strong>Security Notice:</strong> This password reset link expires in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0;">
                  © 2025 My Home Based Business - myhbb.app. All rights reserved.
                </p>
                <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 10px 0 0 0;">
                  Saint Augustine, FL • Connecting Local Communities
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Password Reset Request

Hi ${name},

We received a request to reset your password for your My Home Based Business - myhbb.app account.

Click the link below to reset your password:
${resetUrl}

Security Notice: This password reset link expires in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.

© 2025 My Home Based Business - myhbb.app. All rights reserved.
Saint Augustine, FL • Connecting Local Communities
      `.trim()
    })

    if (response.error) {
      console.error('❌ Email service returned an error:', response.error)
      throw new Error(`Email sending error: ${response.error.message || JSON.stringify(response.error)}`)
    }

    console.log('✅ Password reset email sent successfully. Message ID:', response.id)
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
    throw new Error('Failed to send password reset email')
  }
}

/**
 * Send a business status change email
 * @param email - Business owner's email address
 * @param ownerName - Business owner's name
 * @param businessName - Name of the business
 * @param newStatus - The new status (PENDING, APPROVED, REJECTED)
 * @param options - Additional options including rejection reason and URLs
 */
export async function sendBusinessStatusEmail(
  email: string,
  ownerName: string,
  businessName: string,
  newStatus: 'PENDING' | 'APPROVED' | 'REJECTED',
  options?: {
    rejectionReason?: string
    publicUrl?: string
    editUrl?: string
  }
): Promise<void> {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`

  let subject: string
  let html: string
  let text: string

  switch (newStatus) {
    case 'APPROVED':
      subject = `Congratulations! ${businessName} is now live`
      html = getBusinessApprovedEmailHtml(businessName, options?.publicUrl || dashboardUrl)
      text = getBusinessApprovedEmailText(businessName, options?.publicUrl || dashboardUrl)
      break
    case 'PENDING':
      subject = `Your business listing "${businessName}" requires review`
      html = getBusinessPendingEmailHtml(businessName, dashboardUrl)
      text = getBusinessPendingEmailText(businessName, dashboardUrl)
      break
    case 'REJECTED':
      subject = `Your business listing "${businessName}" was not approved`
      html = getBusinessRejectedEmailHtml(
        businessName,
        options?.rejectionReason || 'No reason provided',
        options?.editUrl || dashboardUrl
      )
      text = getBusinessRejectedEmailText(
        businessName,
        options?.rejectionReason || 'No reason provided',
        options?.editUrl || dashboardUrl
      )
      break
  }

  try {
    console.log(`🔄 Sending business status (${newStatus}) email to:`, email)

    const response = await getEmailService().send({
      from: 'My Home Based Business - myhbb.app <info@myhbb.app>',
      to: email,
      subject,
      html,
      text
    })

    if (response.error) {
      console.error('❌ Email service returned an error:', response.error)
      throw new Error(`Email sending error: ${response.error.message || JSON.stringify(response.error)}`)
    }

    console.log(`✅ Business status (${newStatus}) email sent successfully. Message ID:`, response.id)
  } catch (error) {
    console.error(`❌ Failed to send business status (${newStatus}) email:`, error)
    throw error
  }
}
