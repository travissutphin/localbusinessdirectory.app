export function getMagicLinkEmailHtml(url: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to My Home Based Business</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 520px; width: 100%; border-collapse: collapse;">
          <!-- Header with Brand -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1e40af;">
                My Home Based Business
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748b;">
                Your Local Business Community
              </p>
            </td>
          </tr>

          <!-- Welcome Card -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #ffffff;">
                Welcome to the Community!
              </h2>
              <p style="margin: 0; font-size: 16px; color: #bfdbfe;">
                We&apos;re excited to have you join us
              </p>
            </td>
          </tr>

          <!-- Main Content Card -->
          <tr>
            <td style="background-color: #ffffff; border-radius: 0 0 16px 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #475569; text-align: center;">
                You&apos;re one click away from connecting with local home-based businesses in your area. Whether you&apos;re here to discover amazing services or showcase your own business, you&apos;re in the right place.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="${url}"
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; border-radius: 10px; box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);">
                      Join the Community
                    </a>
                  </td>
                </tr>
              </table>

              <!-- What to Expect -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-top: 8px;">
                <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #1e293b; text-align: center;">
                  What you can do:
                </p>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                      <span style="color: #22c55e; font-weight: bold; margin-right: 8px;">&#10003;</span>
                      Discover local home-based businesses
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                      <span style="color: #22c55e; font-weight: bold; margin-right: 8px;">&#10003;</span>
                      List your own business for free
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                      <span style="color: #22c55e; font-weight: bold; margin-right: 8px;">&#10003;</span>
                      Connect with your local community
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 20px; color: #94a3b8; text-align: center;">
                If you didn&apos;t request this email, you can safely ignore it.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">
                Questions? We&apos;re here to help!
              </p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #94a3b8;">
                &copy; 2025 My Home Based Business. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #cbd5e1;">
                This secure link expires in 24 hours and can only be used once.
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
Welcome to My Home Based Business!
===================================

We're excited to have you join our community!

You're one click away from connecting with local home-based businesses in your area. Whether you're here to discover amazing services or showcase your own business, you're in the right place.

Click the link below to join the community:

${url}

What you can do:
- Discover local home-based businesses
- List your own business for free
- Connect with your local community

This link will expire in 24 hours and can only be used once.

If you didn't request this email, you can safely ignore it.

---
Questions? We're here to help!
My Home Based Business
https://myhbb.app
  `.trim()
}
