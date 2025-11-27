'use client'

import { CheckCircle2, ArrowRight, Search, Globe, Sparkles, Bot, MapPin } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Above the Fold */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Headline & CTA */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
                Get Your Home Business Found by Local Customers
              </h1>
              <p className="text-xl md:text-2xl text-neutral-700 mb-8 leading-relaxed">
                Join the free directory built for home-based businesses. Get discovered by people searching for exactly what you offer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
                >
                  List Your Business Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a
                  href="/directories"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <MapPin className="mr-2 w-5 h-5" />
                  View Directories
                </a>
              </div>
              <p className="mt-6 text-sm text-neutral-600">
                ✓ Free forever &nbsp;&nbsp; ✓ Set up in 3 minutes &nbsp;&nbsp; ✓ No credit card required
              </p>
            </div>

            {/* Right Column - Hero Image Placeholder */}
            <div className="hidden lg:block">
              <div className="relative bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="h-4 bg-neutral-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-neutral-100 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-neutral-100 rounded w-full"></div>
                    <div className="h-3 bg-neutral-100 rounded w-5/6"></div>
                    <div className="h-3 bg-neutral-100 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakes Section - The Problem */}
      <section className="py-16 md:py-24 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Stop Being the Best-Kept Secret in Your Neighborhood
          </h2>
          <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed">
            You&apos;ve built something great. But when potential customers search for services like yours, they find your competitors instead. Every day you stay invisible, you&apos;re missing out on people who need exactly what you offer. <span className="text-primary-400 font-semibold">It doesn&apos;t have to be this way.</span>
          </p>
        </div>
      </section>

      {/* Value Proposition - Guide with Empathy */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white via-primary-50/30 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full opacity-50 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
              <Globe className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Enterprise-Level Visibility</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              We Help Home Businesses Get the Attention They Deserve
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Big brands spend thousands on SEO experts and marketing agencies. We level the playing field by giving your home business the same powerful online presence—<span className="text-primary-600 font-semibold">completely free</span>.
            </p>
          </div>

          {/* Main Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* SEO Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:border-primary-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4">
                  SEO OPTIMIZED
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Rank in Search Results
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Your listing is built with Schema.org LocalBusiness markup—the gold standard that Google, Bing, and Yahoo use to understand and rank local businesses.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    Structured data for rich search results
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    Optimized meta titles and descriptions
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    Canonical URLs for search engines
                  </li>
                </ul>
              </div>
            </div>

            {/* AEO Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:border-purple-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-4">
                  AI DISCOVERABLE
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Found by AI Assistants
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  When customers ask ChatGPT, Google AI, or Siri for local recommendations, your structured business data helps AI understand and suggest your services.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    Machine-readable business information
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    AI-friendly content structure
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    Voice search optimized
                  </li>
                </ul>
              </div>
            </div>

            {/* GEO Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 hover:border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-4">
                  LOCAL TARGETING
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Dominate Local Search
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  Your verified address, service area, and location data are formatted for Google Maps, Apple Maps, and &quot;near me&quot; searches that local customers use daily.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Interactive map on your listing
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Address verification system
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    City and ZIP code targeting
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Stats/Trust Bar */}
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-neutral-400 text-sm">Free Forever</div>
                <div className="text-neutral-500 text-xs mt-1">No hidden fees or premium tiers</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">3 min</div>
                <div className="text-neutral-400 text-sm">Setup Time</div>
                <div className="text-neutral-500 text-xs mt-1">From signup to live listing</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-neutral-400 text-sm">Always Visible</div>
                <div className="text-neutral-500 text-xs mt-1">Your listing works while you sleep</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Plan - 3 Steps */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Getting Found Is Simple
            </h2>
            <p className="text-xl text-neutral-700">
              Three easy steps to start connecting with customers who need what you offer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-600 text-white text-2xl font-bold rounded-full mb-6">
                  1
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Create Your Free Listing
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Add your business details in just 3 minutes. Include your services, contact info, and what makes you special.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-8 h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-secondary-600 text-white text-2xl font-bold rounded-full mb-6">
                  2
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Get Discovered
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Appear when customers search for your services. Your listing is optimized for local search and discovery.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-green-600 text-white text-2xl font-bold rounded-full mb-6">
                  3
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                  Grow Your Business
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  Connect with customers who need what you offer. Watch your calendar fill up with genuine inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explanatory Paragraph */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 text-center">
              Built for Home-Based Businesses
            </h2>
            <p className="text-xl text-neutral-700 leading-relaxed text-center">
              Unlike crowded marketplaces where you compete with everyone, our directory is designed specifically for home-based businesses. We understand that you&apos;re offering personalized service, local expertise, and the kind of care that big companies can&apos;t match. Our platform connects you with customers who value exactly that.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Power Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-neutral-900 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary-700/50 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-primary-100">Powerful Technology, Zero Cost</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Your Business Page Is Built to Be Found
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Every listing includes enterprise-grade search optimization that big companies pay thousands for—yours is free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* SEO Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Search Engine Optimized</h3>
              <p className="text-primary-200 text-sm leading-relaxed">
                Your listing is built with Schema.org structured data—the same technology used by Fortune 500 companies. Google, Bing, and other search engines understand exactly what your business offers.
              </p>
            </div>

            {/* AEO Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Ready Listing</h3>
              <p className="text-primary-200 text-sm leading-relaxed">
                ChatGPT, Google AI, and other AI assistants can read your business details. When customers ask AI for local recommendations, your business can be suggested.
              </p>
            </div>

            {/* GEO Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Local Search Ready</h3>
              <p className="text-primary-200 text-sm leading-relaxed">
                Your complete address, service area, and contact info are formatted for map services and &quot;near me&quot; searches. Customers in your area will find you first.
              </p>
            </div>
          </div>

          {/* What You Get List */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6 text-center">Every Free Listing Includes:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-primary-100 text-sm">LocalBusiness Schema Markup</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-primary-100 text-sm">SEO-Optimized Page Title</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-primary-100 text-sm">Rich Social Media Previews</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-primary-100 text-sm">Interactive Map Location</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-primary-100 text-sm">Mobile-Friendly Design</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-primary-100 text-sm">Direct Contact Links</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-primary-100 text-sm">Social Media Integration</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-primary-100 text-sm">Verified Address Display</span>
              </div>
            </div>
          </div>

          <p className="text-center text-primary-300 mt-8 text-sm">
            The more details you add, the better your listing performs in search results and AI recommendations.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Next Customer Is Searching Right Now
          </h2>
          <p className="text-xl md:text-2xl text-primary-100 mb-10 leading-relaxed">
            Don&apos;t let them find someone else. Get your business listed in minutes—completely free.
          </p>
          <a
            href="/register"
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-primary-600 bg-white rounded-lg hover:bg-neutral-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Claim Your Free Listing
            <ArrowRight className="ml-3 w-6 h-6" />
          </a>
          <p className="mt-8 text-primary-200">
            Join hundreds of home-based businesses already getting found by local customers
          </p>
        </div>
      </section>

      {/* Footer Spacer for Mobile Nav */}
      <div className="h-20 md:h-0"></div>
    </div>
  )
}
