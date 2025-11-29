export function getMagicLinkEmailHtml(url: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to My Home Based Business</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 480px; width: 100%; border-collapse: collapse;">
          <tr>
            <td style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <h1 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #1e293b; text-align: center;">
                My Home Based Business
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #475569; text-align: center;">
                Click the button below to sign in to your account.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="${url}"
                       style="display: inline-block; padding: 14px 32px; background-color: #1e40af; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 6px;">
                      Sign In
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 16px 0; font-size: 13px; line-height: 20px; color: #64748b; text-align: center;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 24px 0; font-size: 12px; line-height: 18px; color: #94a3b8; text-align: center; word-break: break-all;">
                ${url}
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8; text-align: center;">
                This link expires in 24 hours. If you did not request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                My Home Based Business - myhbb.app
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
==================================

Click the link below to sign in to your account:

${url}

This link expires in 24 hours. If you did not request this email, you can safely ignore it.

--
My Home Based Business
myhbb.app
  `.trim()
}

// Business Status Email Templates

export function getBusinessApprovedEmailHtml(businessName: string, publicUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Business is Now Live!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 520px; width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1e40af;">
                My Home Based Business
              </h1>
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #ffffff;">
                Congratulations!
              </h2>
              <p style="margin: 0; font-size: 16px; color: #dcfce7;">
                Your business listing is now live
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border-radius: 0 0 16px 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b; text-align: center;">
                ${businessName}
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #475569; text-align: center;">
                Great news! Your business has been reviewed and approved. Customers can now find you in our directory.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="${publicUrl}"
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; border-radius: 10px;">
                      View Your Listing
                    </a>
                  </td>
                </tr>
              </table>

              <!-- SEO Optimization Info -->
              <div style="background-color: #eff6ff; border-radius: 12px; padding: 24px; margin-top: 8px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #1e40af;">
                  Your Business is Now Easier to Find Online!
                </p>
                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #475569;">
                  Your listing is optimized for search engines and AI assistants. The more complete your profile, the better your visibility.
                </p>
                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #1e293b;">
                  For best results, make sure you&apos;ve added:
                </p>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #475569;">
                      <span style="color: #3b82f6; margin-right: 6px;">&#9679;</span>
                      Business description &amp; hours
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #475569;">
                      <span style="color: #3b82f6; margin-right: 6px;">&#9679;</span>
                      Website &amp; social media links
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 13px; color: #475569;">
                      <span style="color: #3b82f6; margin-right: 6px;">&#9679;</span>
                      Business photo
                    </td>
                  </tr>
                </table>
                <p style="margin: 16px 0 0 0; font-size: 12px; color: #64748b;">
                  <strong>Want to see how Google views your listing?</strong><br>
                  <a href="https://search.google.com/test/rich-results" style="color: #3b82f6; text-decoration: none;">Google Rich Results Test</a> &nbsp;|&nbsp;
                  <a href="https://validator.schema.org/" style="color: #3b82f6; text-decoration: none;">Schema Validator</a>
                </p>
              </div>

              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-top: 16px;">
                <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #1e293b; text-align: center;">
                  Tips for Success:
                </p>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                      <span style="color: #22c55e; font-weight: bold; margin-right: 8px;">&#10003;</span>
                      Share your listing on social media
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                      <span style="color: #22c55e; font-weight: bold; margin-right: 8px;">&#10003;</span>
                      Keep your business hours updated
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #475569;">
                      <span style="color: #22c55e; font-weight: bold; margin-right: 8px;">&#10003;</span>
                      Respond promptly to customer inquiries
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2025 My Home Based Business. All rights reserved.
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

export function getBusinessApprovedEmailText(businessName: string, publicUrl: string): string {
  return `
Congratulations! Your Business is Now Live
==========================================

${businessName}

Great news! Your business has been reviewed and approved. Customers can now find you in our directory.

View your listing: ${publicUrl}

----------------------------------------
YOUR BUSINESS IS NOW EASIER TO FIND ONLINE!
----------------------------------------

Your listing is optimized for search engines and AI assistants. The more complete your profile, the better your visibility.

For best results, make sure you've added:
- Business description & hours
- Website & social media links
- Business photo

Want to see how Google views your listing?
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/

Tips for Success:
- Share your listing on social media
- Keep your business hours updated
- Respond promptly to customer inquiries

---
My Home Based Business
https://myhbb.app
  `.trim()
}

export function getBusinessPendingEmailHtml(businessName: string, dashboardUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Business Listing Requires Review</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 520px; width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1e40af;">
                My Home Based Business
              </h1>
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, #ca8a04 0%, #eab308 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #ffffff;">
                Review Required
              </h2>
              <p style="margin: 0; font-size: 16px; color: #fef9c3;">
                Your business listing status has changed
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border-radius: 0 0 16px 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b; text-align: center;">
                ${businessName}
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #475569; text-align: center;">
                Your business listing has been set to pending review. Our team will review it shortly and you will be notified once it is approved.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="${dashboardUrl}"
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ca8a04 0%, #eab308 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; border-radius: 10px;">
                      View Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #fefce8; border-radius: 12px; padding: 24px; margin-top: 8px;">
                <p style="margin: 0; font-size: 14px; color: #854d0e; text-align: center;">
                  No action is required from you at this time. We will notify you once the review is complete.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2025 My Home Based Business. All rights reserved.
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

export function getBusinessPendingEmailText(businessName: string, dashboardUrl: string): string {
  return `
Your Business Listing Requires Review
=====================================

${businessName}

Your business listing has been set to pending review. Our team will review it shortly and you will be notified once it is approved.

View your dashboard: ${dashboardUrl}

No action is required from you at this time. We will notify you once the review is complete.

---
My Home Based Business
https://myhbb.app
  `.trim()
}

export function getBusinessRejectedEmailHtml(businessName: string, reason: string, editUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Business Listing Was Not Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 520px; width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1e40af;">
                My Home Based Business
              </h1>
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #ffffff;">
                Listing Not Approved
              </h2>
              <p style="margin: 0; font-size: 16px; color: #fecaca;">
                Action required to publish your business
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border-radius: 0 0 16px 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b; text-align: center;">
                ${businessName}
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #475569; text-align: center;">
                Unfortunately, your business listing was not approved. Please review the feedback below and make the necessary changes.
              </p>
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #991b1b;">
                  Reason for rejection:
                </p>
                <p style="margin: 0; font-size: 14px; color: #7f1d1d;">
                  ${reason}
                </p>
              </div>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="${editUrl}"
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; border-radius: 10px;">
                      Edit Your Listing
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 14px; color: #64748b; text-align: center;">
                After making changes, your listing will be submitted for review again.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">
                Need help? Contact us at support@myhbb.app
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2025 My Home Based Business. All rights reserved.
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

export function getBusinessRejectedEmailText(businessName: string, reason: string, editUrl: string): string {
  return `
Your Business Listing Was Not Approved
======================================

${businessName}

Unfortunately, your business listing was not approved. Please review the feedback below and make the necessary changes.

REASON FOR REJECTION:
${reason}

Edit your listing: ${editUrl}

After making changes, your listing will be submitted for review again.

---
Need help? Contact us at support@myhbb.app
My Home Based Business
https://myhbb.app
  `.trim()
}

// Admin notification templates

export function getAdminPendingBusinessEmailHtml(
  businessName: string,
  ownerName: string,
  ownerEmail: string,
  locationName: string,
  directoryName: string,
  adminUrl: string,
  isUpdate: boolean = false,
  changes?: Array<{ field: string; oldValue: string; newValue: string }>
): string {
  const action = isUpdate ? 'Updated' : 'New'

  const truncate = (str: string, maxLen: number = 100) => {
    if (str.length <= maxLen) return str
    return str.substring(0, maxLen) + '...'
  }

  const changesHtml = isUpdate && changes && changes.length > 0 ? `
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #92400e;">
                  Changes Made (${changes.length} field${changes.length > 1 ? 's' : ''} updated):
                </p>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  ${changes.map(change => `
                  <tr>
                    <td colspan="2" style="padding: 12px 0 4px 0; font-size: 13px; font-weight: 600; color: #1e293b; border-top: 1px solid #fde68a;">
                      ${change.field}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 12px; color: #dc2626; width: 50%; vertical-align: top;">
                      <span style="font-weight: 600;">OLD:</span><br>
                      <span style="word-break: break-word;">${truncate(change.oldValue)}</span>
                    </td>
                    <td style="padding: 4px 0 4px 12px; font-size: 12px; color: #16a34a; width: 50%; vertical-align: top;">
                      <span style="font-weight: 600;">NEW:</span><br>
                      <span style="word-break: break-word;">${truncate(change.newValue)}</span>
                    </td>
                  </tr>
                  `).join('')}
                </table>
              </div>` : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${action} Business Pending Review</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 520px; width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1e40af;">
                My Home Based Business
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748b;">
                Admin Notification
              </p>
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #ffffff;">
                ${action} Business Pending
              </h2>
              <p style="margin: 0; font-size: 16px; color: #fed7aa;">
                A business listing requires your review
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border-radius: 0 0 16px 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b;">
                ${businessName}
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Owner:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #1e293b; text-align: right;">${ownerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Email:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #1e293b; text-align: right;">${ownerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Location:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #1e293b; text-align: right;">${locationName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Category:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #1e293b; text-align: right;">${directoryName}</td>
                </tr>
              </table>
              ${changesHtml}
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 8px 0;">
                    <a href="${adminUrl}"
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; border-radius: 10px;">
                      Review Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2025 My Home Based Business. All rights reserved.
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

export function getAdminPendingBusinessEmailText(
  businessName: string,
  ownerName: string,
  ownerEmail: string,
  locationName: string,
  directoryName: string,
  adminUrl: string,
  isUpdate: boolean = false,
  changes?: Array<{ field: string; oldValue: string; newValue: string }>
): string {
  const action = isUpdate ? 'Updated' : 'New'

  const truncate = (str: string, maxLen: number = 100) => {
    if (str.length <= maxLen) return str
    return str.substring(0, maxLen) + '...'
  }

  const changesText = isUpdate && changes && changes.length > 0
    ? `\nCHANGES MADE (${changes.length} field${changes.length > 1 ? 's' : ''} updated):\n${'-'.repeat(40)}\n${changes.map(change =>
        `${change.field}:\n  OLD: ${truncate(change.oldValue)}\n  NEW: ${truncate(change.newValue)}`
      ).join('\n\n')}\n${'-'.repeat(40)}\n`
    : ''

  return `
${action} Business Pending Review
${'='.repeat(action.length + 24)}

A business listing requires your review.

Business: ${businessName}
Owner: ${ownerName}
Email: ${ownerEmail}
Location: ${locationName}
Category: ${directoryName}
${changesText}
Review now: ${adminUrl}

---
My Home Based Business - Admin Notification
https://myhbb.app
  `.trim()
}

export function getBusinessUpdatedPendingEmailHtml(businessName: string, dashboardUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Business Listing Update is Pending Review</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 520px; width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1e40af;">
                My Home Based Business
              </h1>
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, #ca8a04 0%, #eab308 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #ffffff;">
                Update Received
              </h2>
              <p style="margin: 0; font-size: 16px; color: #fef9c3;">
                Your changes are pending review
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border-radius: 0 0 16px 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e293b; text-align: center;">
                ${businessName}
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 26px; color: #475569; text-align: center;">
                Your business listing has been updated and is now pending review. Our team will review your changes shortly and you will be notified once approved.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="${dashboardUrl}"
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #ca8a04 0%, #eab308 100%); color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 600; border-radius: 10px;">
                      View Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #fefce8; border-radius: 12px; padding: 24px; margin-top: 8px;">
                <p style="margin: 0; font-size: 14px; color: #854d0e; text-align: center;">
                  Your listing will not be visible to the public until it has been approved.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2025 My Home Based Business. All rights reserved.
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

export function getBusinessUpdatedPendingEmailText(businessName: string, dashboardUrl: string): string {
  return `
Your Business Listing Update is Pending Review
===============================================

${businessName}

Your business listing has been updated and is now pending review. Our team will review your changes shortly and you will be notified once approved.

View your dashboard: ${dashboardUrl}

Your listing will not be visible to the public until it has been approved.

---
My Home Based Business
https://myhbb.app
  `.trim()
}
