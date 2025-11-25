export function getMagicLinkEmailHtml(url: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to My Home Based Business</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 480px; width: 100%; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #18181b;">
                My Home Based Business
              </h1>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #18181b; text-align: center;">
                Sign in to your account
              </h2>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #52525b; text-align: center;">
                Click the button below to securely sign in. This link will expire in 24 hours.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${url}"
                       style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Sign In
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 20px; color: #71717a; text-align: center;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #a1a1aa;">
                This is an automated message from My Home Based Business
              </p>
              <p style="margin: 0; font-size: 12px; color: #a1a1aa;">
                &copy; 2025 myhbb.app. All rights reserved.
              </p>
            </td>
          </tr>

          <!-- Security Note -->
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #d4d4d8;">
                For security, this link can only be used once and expires in 24 hours.
                <br>Never share this link with anyone.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function getMagicLinkEmailText(url: string): string {
  return `
Sign in to My Home Based Business

Click the link below to securely sign in to your account:

${url}

This link will expire in 24 hours and can only be used once.

If you didn't request this email, you can safely ignore it.

---
My Home Based Business
https://myhbb.app
  `.trim()
}
