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
              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-top: 8px;">
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
  isUpdate: boolean = false
): string {
  const action = isUpdate ? 'Updated' : 'New'
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
  isUpdate: boolean = false
): string {
  const action = isUpdate ? 'Updated' : 'New'
  return `
${action} Business Pending Review
${'='.repeat(action.length + 24)}

A business listing requires your review.

Business: ${businessName}
Owner: ${ownerName}
Email: ${ownerEmail}
Location: ${locationName}
Category: ${directoryName}

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
