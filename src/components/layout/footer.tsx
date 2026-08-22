'use client';

import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  Star,
  Shield,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  const navSections = [
    {
      title: 'Discover',
      links: [
        { label: 'All Businesses', href: '/businesses' },
        { label: 'Restaurants', href: '/business-category/restaurants' },
        { label: 'Shopping', href: '/business-category/shopping' },
        { label: 'Beauty & Spa', href: '/business-category/beauty' },
        { label: 'Fitness', href: '/business-category/fitness' },
      ],
    },
    {
      title: 'Locations',
      links: [
        { label: 'New York City', href: '/location/new-york-city' },
        { label: 'Los Angeles', href: '/location/los-angeles' },
        { label: 'Chicago', href: '/location/chicago' },
        { label: 'Houston', href: '/location/houston' },
        { label: 'Miami', href: '/location/miami' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Safety Center', href: '/safety' },
        { label: 'Community', href: '/guidelines' },
        { label: 'Terms', href: '/terms' },
        { label: 'Privacy', href: '/privacy' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Business Guide', href: '/guide' },
        { label: 'API Docs', href: '/api' },
        { label: 'Status', href: '/status' },
        { label: 'Changelog', href: '/changelog' },
        { label: 'Documentation', href: '/docs' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Accessibility', href: '/accessibility' },
        { label: 'Licenses', href: '/licenses' },
      ],
    },
  ];

  const features = [
    { icon: Star, text: 'AI-Powered Search' },
    { icon: Shield, text: 'Verified Listings' },
    { icon: Zap, text: 'Instant Updates' },
  ];

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section: 6 nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-[#0a897d] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter + Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12 border-b border-gray-100">
          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              Get the latest updates on new businesses, special offers, and local events delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a897d] focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#0a897d] text-white text-sm font-medium rounded-lg hover:bg-[#086e65] transition-colors flex items-center gap-2"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="flex items-center gap-6 pt-2">
              {features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-2 text-gray-500">
                  <feature.icon className="h-4 w-4 text-[#0a897d]" />
                  <span className="text-xs">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Get in touch</h3>
            <p className="text-sm text-gray-600">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@indexorbit.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#0a897d] transition-colors">
                <Mail className="h-5 w-5 text-gray-400" />
                hello@indexorbit.com
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="h-5 w-5 text-gray-400" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400" />
                123 Business Ave, Suite 100
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} IndexOrbit. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-[#0a897d] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-[#0a897d] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-[#0a897d] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
