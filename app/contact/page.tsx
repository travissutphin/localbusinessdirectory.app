'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-secondary">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-neutral-200">
            Have questions, suggestions, or need support? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Success Message */}
          {status === 'success' && (
            <div className="card-dark text-white mb-8 border-green-500 bg-green-900/20">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-green-400">Message Sent Successfully!</h3>
                  <p className="text-neutral-300">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="card-dark text-white mb-8 border-red-500 bg-red-900/20">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-red-400">Error Sending Message</h3>
                  <p className="text-neutral-300">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <div className="card-dark text-white">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8 text-secondary-500" />
              <h2 className="text-3xl font-bold">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-dark"
                  placeholder="John Doe"
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-dark"
                  placeholder="john@example.com"
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-dark"
                  placeholder="What is this regarding?"
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-dark resize-none"
                  placeholder="Tell us how we can help..."
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn btn-primary w-full text-lg py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="card-dark text-white">
              <h3 className="text-xl font-bold mb-3 text-secondary-400">Business Inquiries</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Interested in listing your business or have questions about our services?
                We're here to help you connect with your community.
              </p>
            </div>

            <div className="card-dark text-white">
              <h3 className="text-xl font-bold mb-3 text-secondary-400">Technical Support</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Experiencing technical issues or need help with your account?
                Let us know and we'll assist you as quickly as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="card-dark text-white">
              <h3 className="text-xl font-bold mb-2 text-secondary-400">How long does it take to get a response?</h3>
              <p className="text-neutral-300 leading-relaxed">
                We typically respond to all inquiries within 1-2 business days. For urgent matters,
                please indicate this in your subject line.
              </p>
            </div>

            <div className="card-dark text-white">
              <h3 className="text-xl font-bold mb-2 text-secondary-400">How do I list my business?</h3>
              <p className="text-neutral-300 leading-relaxed">
                Create an account and submit your business information through our dashboard.
                All listings are reviewed by our team before being published.
              </p>
            </div>

            <div className="card-dark text-white">
              <h3 className="text-xl font-bold mb-2 text-secondary-400">Is there a cost to list my business?</h3>
              <p className="text-neutral-300 leading-relaxed">
                Basic business listings are completely free. We believe in supporting local businesses
                by providing them with the tools they need to reach their community.
              </p>
            </div>

            <div className="card-dark text-white">
              <h3 className="text-xl font-bold mb-2 text-secondary-400">Can I update my business information?</h3>
              <p className="text-neutral-300 leading-relaxed">
                Yes! Once your business is listed, you can log in to your dashboard at any time to
                update your information, hours, contact details, and more.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
