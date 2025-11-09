import { Resend } from 'resend'
import nodemailer from 'nodemailer'

export interface EmailService {
  send(params: {
    from: string
    to: string
    subject: string
    html: string
    text: string
  }): Promise<{ id: string | null; error: any | null }>
}

class ResendEmailService implements EmailService {
  private resend: Resend

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey)
  }

  async send(params: {
    from: string
    to: string
    subject: string
    html: string
    text: string
  }): Promise<{ id: string | null; error: any | null }> {
    try {
      const response = await this.resend.emails.send({
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      })

      if (response.error) {
        return { id: null, error: response.error }
      }

      return { id: response.data?.id || null, error: null }
    } catch (error) {
      return { id: null, error }
    }
  }
}

class MailHogEmailService implements EmailService {
  private transporter: nodemailer.Transporter

  constructor(host: string = 'localhost', port: number = 1025) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  async send(params: {
    from: string
    to: string
    subject: string
    html: string
    text: string
  }): Promise<{ id: string | null; error: any | null }> {
    try {
      const info = await this.transporter.sendMail({
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      })

      return { id: info.messageId, error: null }
    } catch (error) {
      return { id: null, error }
    }
  }
}

/**
 * Create email service based on environment configuration
 * @returns EmailService instance (Resend or MailHog)
 */
export function createEmailService(): EmailService {
  const provider = process.env.EMAIL_PROVIDER || 'resend'

  console.log(`📧 Email service provider: ${provider}`)

  if (provider === 'mailhog') {
    console.log('📧 Using MailHog SMTP for local email testing')
    return new MailHogEmailService()
  }

  // Default to Resend for production
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY not found, email sending may fail')
  }
  console.log('📧 Using Resend API for email delivery')
  return new ResendEmailService(apiKey || '')
}
