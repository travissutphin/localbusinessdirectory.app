'use client'

import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

export default function GlobalFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="hidden md:block bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/images/logo-myhbb.png"
              alt="My Home Based Business - myhbb.app"
              width={180}
              height={48}
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-md">
              The free directory built for home-based businesses. Get discovered by local customers searching for exactly what you offer.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/about"
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/privacy"
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/code-of-conduct"
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Code of Conduct
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-neutral-500 text-sm">
              © {currentYear} My Home Based Business - myhbb.app. All rights reserved.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
