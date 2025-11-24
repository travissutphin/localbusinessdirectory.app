import { Metadata } from 'next'
import { Shield, Eye, Lock, Database, UserCheck, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | My Home Based Business - myhbb.app',
  description: 'Learn how we collect, use, and protect your personal information when you use our local business directory platform.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-secondary">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-neutral-200">
            Last Updated: November 3, 2025
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Introduction */}
          <div className="card-dark text-white">
            <h2 className="text-3xl font-bold mb-4">Introduction</h2>
            <p className="text-neutral-300 leading-relaxed">
              At My Home Based Business - myhbb.app, we are committed to protecting your privacy and ensuring
              the security of your personal information. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our platform.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="card-dark text-white">
            <div className="flex items-start gap-4 mb-4">
              <Database className="w-8 h-8 text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Personal Information</h3>
                <p className="text-neutral-300 leading-relaxed mb-2">
                  When you register for an account or list a business, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                  <li>Name and email address</li>
                  <li>Business name and contact information</li>
                  <li>Business description and category</li>
                  <li>Phone number and website</li>
                  <li>Business hours and location</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Automatically Collected Information</h3>
                <p className="text-neutral-300 leading-relaxed mb-2">
                  When you access our platform, we automatically collect:
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Search queries and interactions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Cookies and Tracking Technologies</h3>
                <p className="text-neutral-300 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience,
                  remember your preferences, and analyze site usage. You can control cookie
                  preferences through your browser settings.
                </p>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="card-dark text-white">
            <div className="flex items-start gap-4 mb-4">
              <Eye className="w-8 h-8 text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">How We Use Your Information</h2>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>

            <ul className="space-y-3 text-neutral-300">
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Provide Services:</strong> To operate and maintain the platform, display business listings, and facilitate connections</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Account Management:</strong> To create and manage your account, authenticate users, and process requests</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Communication:</strong> To send important updates, respond to inquiries, and provide customer support</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Improvement:</strong> To analyze usage patterns, improve our services, and develop new features</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms of service</span>
              </li>
            </ul>
          </div>

          {/* Information Sharing */}
          <div className="card-dark text-white">
            <div className="flex items-start gap-4 mb-4">
              <UserCheck className="w-8 h-8 text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Information Sharing and Disclosure</h2>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Public Business Listings</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Business information you submit (business name, description, contact info, hours, location)
                  is displayed publicly on our platform to facilitate discovery and connections.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Service Providers</h3>
                <p className="text-neutral-300 leading-relaxed">
                  We may share information with trusted third-party service providers who assist in
                  operating our platform, conducting business, or serving users (e.g., hosting, analytics,
                  email services). These providers are bound by confidentiality agreements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Legal Requirements</h3>
                <p className="text-neutral-300 leading-relaxed">
                  We may disclose information when required by law, to respond to legal processes,
                  protect our rights, or ensure the safety of our users and platform.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Business Transfers</h3>
                <p className="text-neutral-300 leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, user information may be
                  transferred as part of the business transaction.
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="card-dark text-white">
            <div className="flex items-start gap-4 mb-4">
              <Lock className="w-8 h-8 text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Data Security</h2>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>

            <ul className="space-y-2 text-neutral-300">
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span>Encrypted data transmission using SSL/TLS protocols</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span>Secure password hashing and authentication</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span>Regular security audits and vulnerability assessments</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span>Access controls and data minimization practices</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span>Monitoring and incident response procedures</span>
              </li>
            </ul>

            <p className="text-neutral-300 leading-relaxed mt-4">
              While we strive to protect your information, no method of transmission over the internet
              or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </div>

          {/* Your Rights */}
          <div className="card-dark text-white">
            <div className="flex items-start gap-4 mb-4">
              <FileText className="w-8 h-8 text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Your Privacy Rights</h2>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>

            <ul className="space-y-3 text-neutral-300">
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Access:</strong> Request a copy of the personal information we hold about you</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Correction:</strong> Request correction of inaccurate or incomplete information</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Deletion:</strong> Request deletion of your account and associated data</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</span>
              </li>
              <li className="flex gap-3">
                <span className="text-secondary-500 flex-shrink-0">•</span>
                <span><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</span>
              </li>
            </ul>

            <p className="text-neutral-300 leading-relaxed mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="/contact" className="text-secondary-400 hover:text-secondary-500 underline">
                our contact page
              </a>.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="card-dark text-white">
            <h2 className="text-3xl font-bold mb-4">Children&apos;s Privacy</h2>
            <p className="text-neutral-300 leading-relaxed">
              Our platform is not intended for children under the age of 13. We do not knowingly
              collect personal information from children. If we become aware that we have collected
              information from a child under 13, we will take steps to delete it promptly.
            </p>
          </div>

          {/* Third-Party Links */}
          <div className="card-dark text-white">
            <h2 className="text-3xl font-bold mb-4">Third-Party Links</h2>
            <p className="text-neutral-300 leading-relaxed">
              Our platform may contain links to third-party websites and services. We are not
              responsible for the privacy practices of these external sites. We encourage you to
              review the privacy policies of any third-party sites you visit.
            </p>
          </div>

          {/* Changes to Policy */}
          <div className="card-dark text-white">
            <h2 className="text-3xl font-bold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-neutral-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices,
              technology, legal requirements, or other factors. We will notify you of any material changes
              by posting the updated policy on this page with a new &quot;Last Updated&quot; date. Your continued
              use of our platform after changes are posted constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* Contact Information */}
          <div className="card-dark text-white bg-gradient-to-r from-primary-900 to-primary-800 border-secondary-500">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please contact us:
            </p>
            <a
              href="/contact"
              className="btn btn-primary inline-block"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
