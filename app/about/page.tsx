import { Metadata } from 'next'
import { Building2, MapPin, Users, Star, Shield, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Local Business Directory',
  description: 'Learn about our mission to connect local businesses with their communities through a comprehensive, easy-to-use directory platform.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Connecting Communities with Local Business
          </h1>
          <p className="text-xl text-neutral-200 leading-relaxed">
            We believe in the power of local businesses to transform communities.
            Our platform makes it easy for customers to discover, connect with, and support
            the businesses that make their neighborhoods thrive.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="card-dark text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-neutral-300 leading-relaxed text-center max-w-3xl mx-auto">
              To empower local businesses by providing them with the tools and visibility they need
              to reach their community, while making it effortless for customers to find exactly
              what they're looking for in their neighborhood.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            What Makes Us Different
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-dark text-white group hover:border-secondary-500 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4 shadow-secondary">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Location-Focused</h3>
              <p className="text-neutral-300 leading-relaxed">
                Find businesses by city and neighborhood. We make local search truly local,
                connecting you with businesses in your specific area.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-dark text-white group hover:border-secondary-500 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4 shadow-secondary">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Comprehensive Categories</h3>
              <p className="text-neutral-300 leading-relaxed">
                From restaurants to professional services, we organize businesses into
                intuitive categories making discovery effortless.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-dark text-white group hover:border-secondary-500 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4 shadow-secondary">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Verified Listings</h3>
              <p className="text-neutral-300 leading-relaxed">
                All business listings are reviewed and verified to ensure accuracy
                and authenticity for our community.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-dark text-white group hover:border-secondary-500 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4 shadow-secondary">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Business Owner Dashboard</h3>
              <p className="text-neutral-300 leading-relaxed">
                Free tools for business owners to manage their listings, update information,
                and connect with customers.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-dark text-white group hover:border-secondary-500 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4 shadow-secondary">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Quality First</h3>
              <p className="text-neutral-300 leading-relaxed">
                We prioritize quality over quantity, curating listings that provide
                real value to our community.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-dark text-white group hover:border-secondary-500 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4 shadow-secondary">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Fast & Easy</h3>
              <p className="text-neutral-300 leading-relaxed">
                Intuitive search and filtering make finding the right business quick
                and effortless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            How It Works
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="card-dark text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Search Your Area</h3>
                  <p className="text-neutral-300 leading-relaxed">
                    Select your city and browse categories or search for specific services.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card-dark text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Discover Businesses</h3>
                  <p className="text-neutral-300 leading-relaxed">
                    View detailed business profiles with contact information, hours, and descriptions.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card-dark text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Connect & Support</h3>
                  <p className="text-neutral-300 leading-relaxed">
                    Contact businesses directly and support your local community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-dark text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
              Whether you're looking for local services or want to list your business,
              we're here to help connect your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="btn btn-primary text-lg px-8 py-3"
              >
                Browse Businesses
              </a>
              <a
                href="/contact"
                className="btn btn-outline text-lg px-8 py-3"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
