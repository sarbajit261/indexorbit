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
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0a897d] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Logo className="h-12 w-auto" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Discover local businesses with AI-powered search. Find restaurants,
              hotels, shops, service providers, and more in your area.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#0a897d] hover:text-white hover:border-[#0a897d] transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Discover
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'All Businesses', href: '/businesses' },
                { label: 'Categories', href: '/category' },
                { label: 'Business Types', href: '/business-types' },
                { label: 'Offers', href: '/offers' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#0a897d] transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Careers', href: '/careers' },
                { label: 'Blog', href: '/blog' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#0a897d] transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates on new businesses and exclusive offers in your area.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0a897d] focus:ring-1 focus:ring-[#0a897d] transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#0a897d] hover:bg-[#097a71] text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <a href="mailto:hello@indexorbit.com" className="flex items-center gap-3 text-gray-400 text-sm hover:text-[#0a897d] transition-colors">
                <Mail className="h-4 w-4" />
                hello@indexorbit.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-3 text-gray-400 text-sm hover:text-[#0a897d] transition-colors">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </a>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                123 Business Ave, Suite 100
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
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
      </div>
    </footer>
  );
}
