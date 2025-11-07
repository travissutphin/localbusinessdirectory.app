import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    await resend.emails.send({
      from: 'Local Business Directory <noreply@localbusinessdirectory.app>',
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
                  Welcome to Local Business Directory!
                </h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Hi <strong>${name}</strong>,
                </p>

                <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  Thank you for registering with Local Business Directory! We're excited to have you join our community of local business owners.
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
                  © 2025 Local Business Directory. All rights reserved.
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
Welcome to Local Business Directory!

Hi ${name},

Thank you for registering with Local Business Directory! We're excited to have you join our community of local business owners.

Please verify your email address by clicking the link below:

${verificationUrl}

This verification link expires in 24 hours. If you didn't create this account, you can safely ignore this email.

© 2025 Local Business Directory. All rights reserved.
Saint Augustine, FL • Connecting Local Communities
      `.trim()
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}
