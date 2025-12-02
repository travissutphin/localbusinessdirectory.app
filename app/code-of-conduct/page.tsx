import { Metadata } from 'next'
import { Heart, Users, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Code of Conduct | Front Door Directory',
  description: 'Our community guidelines and code of conduct for business owners, users, and all members of the Front Door Directory platform.',
}

export default function CodeOfConductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-secondary">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Code of Conduct
          </h1>
          <p className="text-xl text-neutral-200">
            Building a respectful, inclusive community together
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Introduction */}
          <div className="card-dark text-white">
            <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
            <p className="text-neutral-300 leading-relaxed">
              Front Door Directory is committed to providing a welcoming, safe, and inclusive
              platform for all members of our community. This Code of Conduct outlines our expectations
              for behavior and the consequences for unacceptable conduct. By using our platform, you
              agree to abide by these guidelines.
            </p>
          </div>

          {/* Core Values */}
          <div className="card-dark text-white">
            <div className="flex items-start gap-4 mb-4">
              <Users className="w-8 h-8 text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-neutral-900/50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Respect</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Treat all community members with dignity and courtesy, regardless of background or beliefs.
                </p>
              </div>

              <div className="bg-neutral-900/50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Integrity</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Provide accurate information and honest reviews. Build trust through transparency.
                </p>
              </div>

              <div className="bg-neutral-900/50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Inclusivity</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Welcome and support all individuals regardless of race, gender, age, ability, or background.
                </p>
              </div>

              <div className="bg-neutral-900/50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Professionalism</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Maintain professional standards in all interactions and business representations.
                </p>
              </div>
            </div>
          </div>

          {/* Expected Behavior */}
          <div className="card-dark text-white">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Expected Behavior</h2>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed mb-4">
              We expect all community members to:
            </p>

            <ul className="space-y-3 text-neutral-300">
              <li className="flex gap-3">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>Be Respectful:</strong> Show consideration for others&apos; time, perspectives, and experiences</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>Communicate Professionally:</strong> Use appropriate language and tone in all interactions</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>Provide Accurate Information:</strong> Ensure business listings and reviews are truthful and current</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>Respect Privacy:</strong> Protect personal and business information appropriately</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>Follow the Law:</strong> Comply with all applicable local, state, and federal laws</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>Report Issues:</strong> Alert us to violations or concerns promptly and appropriately</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 flex-shrink-0">✓</span>
                <span><strong>Support Local:</strong> Engage constructively to strengthen the local business community</span>
              </li>
            </ul>
          </div>

          {/* Unacceptable Behavior */}
          <div className="card-dark text-white border-red-500/30">
            <div className="flex items-start gap-4 mb-4">
              <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Unacceptable Behavior</h2>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed mb-4">
              The following behaviors are not tolerated on our platform:
            </p>

            <ul className="space-y-3 text-neutral-300">
              <li className="flex gap-3">
                <span className="text-red-500 flex-shrink-0">✗</span>
                <span><strong>Harassment:</strong> Intimidation, bullying, stalking, or unwelcome contact of any kind</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 flex-shrink-0">✗</span>
                <span><strong>Discrimination:</strong> Bias or prejudice based on race, ethnicity, gender, religion, age, disability, sexual orientation, or any protected characteristic</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 flex-shrink-0">✗</span>
                <span><strong>False Information:</strong> Deliberately misleading listings, fake reviews, or fraudulent business claims</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 flex-shrink-0">✗</span>
                <span><strong>Spam:</strong> Unsolicited advertising, repetitive content, or manipulative practices</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 flex-shrink-0">✗</span>
                <span><strong>Impersonation:</strong> Falsely representing another person, business, or organization</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 flex-shrink-0">✗</span>
                <span><strong>Threats or Violence:</strong> Threatening language, violent content, or incitement to harm</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 flex-shrink-0">✗</span>
                <span><strong>Illegal Activity:</strong> Promoting or engaging in illegal goods, services, or activities</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 flex-shrink-0">✗</span>
                <span><strong>Privacy Violations:</strong> Sharing private information without consent (doxxing)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 flex-shrink-0">✗</span>
                <span><strong>Platform Abuse:</strong> Attempting to exploit, hack, or damage the platform or other users</span>
              </li>
            </ul>
          </div>

          {/* Business Listings Guidelines */}
          <div className="card-dark text-white">
            <h2 className="text-3xl font-bold mb-4">Business Listings Guidelines</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Accuracy Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                  <li>Provide current and accurate business information</li>
                  <li>Update hours, contact info, and services regularly</li>
                  <li>Use real photos of your business (no stock images)</li>
                  <li>Describe services accurately without false claims</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Ownership Verification</h3>
                <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                  <li>Only claim businesses you own or have authority to represent</li>
                  <li>One listing per physical business location</li>
                  <li>Do not create duplicate or fake listings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2 text-secondary-400">Prohibited Business Types</h3>
                <p className="text-neutral-300 leading-relaxed">
                  Businesses that promote illegal activities, discriminatory services, or adult content
                  are not permitted on our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Enforcement */}
          <div className="card-dark text-white">
            <div className="flex items-start gap-4 mb-4">
              <Shield className="w-8 h-8 text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Enforcement and Consequences</h2>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed mb-4">
              Violations of this Code of Conduct may result in the following actions at our discretion:
            </p>

            <div className="space-y-4">
              <div className="bg-neutral-900/50 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2 text-yellow-400">Warning</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  First-time or minor violations may result in a warning with explanation of the violation.
                </p>
              </div>

              <div className="bg-neutral-900/50 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2 text-orange-400">Content Removal</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Removal of content that violates our guidelines (listings, reviews, comments).
                </p>
              </div>

              <div className="bg-neutral-900/50 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2 text-red-400">Account Suspension</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Temporary restriction of account access for repeated or moderate violations.
                </p>
              </div>

              <div className="bg-neutral-900/50 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2 text-red-600">Permanent Ban</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Permanent removal from the platform for serious or repeated violations.
                </p>
              </div>

              <div className="bg-neutral-900/50 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2 text-purple-400">Legal Action</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Severe violations may be reported to law enforcement authorities.
                </p>
              </div>
            </div>
          </div>

          {/* Reporting Violations */}
          <div className="card-dark text-white">
            <div className="flex items-start gap-4 mb-4">
              <AlertTriangle className="w-8 h-8 text-secondary-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-3xl font-bold mb-4">Reporting Violations</h2>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed mb-4">
              If you witness or experience a violation of this Code of Conduct:
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-2xl font-bold text-secondary-500 flex-shrink-0">1</span>
                <div>
                  <h3 className="text-lg font-bold mb-1">Document the Violation</h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Take screenshots or note specific details including dates, usernames, and content.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl font-bold text-secondary-500 flex-shrink-0">2</span>
                <div>
                  <h3 className="text-lg font-bold mb-1">Submit a Report</h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Contact us through our contact form with details of the violation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl font-bold text-secondary-500 flex-shrink-0">3</span>
                <div>
                  <h3 className="text-lg font-bold mb-1">We Investigate</h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    Our team will review the report and take appropriate action within 3-5 business days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl font-bold text-secondary-500 flex-shrink-0">4</span>
                <div>
                  <h3 className="text-lg font-bold mb-1">Follow Up</h3>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    We&apos;ll notify you of the outcome while respecting privacy of all parties involved.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm leading-relaxed">
                <strong>Urgent Safety Concerns:</strong> If you believe someone is in immediate danger,
                contact local law enforcement or emergency services immediately.
              </p>
            </div>
          </div>

          {/* Appeals */}
          <div className="card-dark text-white">
            <h2 className="text-3xl font-bold mb-4">Appeals Process</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              If you believe an enforcement action was taken in error, you may appeal the decision:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-300 ml-4">
              <li>Submit an appeal through our contact form within 30 days</li>
              <li>Provide additional context or evidence supporting your case</li>
              <li>Our review team will reconsider the decision</li>
              <li>Appeal decisions are final and binding</li>
            </ul>
          </div>

          {/* Changes to Code */}
          <div className="card-dark text-white">
            <h2 className="text-3xl font-bold mb-4">Updates to This Code of Conduct</h2>
            <p className="text-neutral-300 leading-relaxed">
              We may update this Code of Conduct periodically to reflect evolving community standards,
              legal requirements, or platform changes. Significant changes will be communicated to
              active users. Your continued use of the platform constitutes acceptance of the updated Code.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="card-dark text-white bg-gradient-to-r from-primary-900 to-primary-800 border-secondary-500">
            <h2 className="text-3xl font-bold mb-4">Questions or Concerns?</h2>
            <p className="text-neutral-300 leading-relaxed mb-6">
              If you have questions about this Code of Conduct or need to report a violation,
              please reach out to us.
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
