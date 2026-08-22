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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

interface SiteSettings {
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  socialTwitter: string | null;
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialLinkedin: string | null;
  newsletterTitle: string;
  newsletterDesc: string;
  footerBrandDesc: string;
  siteName: string;
}

const footerNavigation = {
  discover: {
    title: 'Discover',
    links: [
      { label: 'All Businesses', href: '/businesses' },
      { label: 'Restaurants', href: '/business-category/restaurants' },
      { label: 'Hotels', href: '/business-category/hotels' },
      { label: 'Shopping', href: '/business-category/shopping' },
      { label: 'Services', href: '/business-category/service' },
      { label: 'Beauty', href: '/business-category/salon' },
      { label: 'Fitness', href: '/business-category/gym' },
    ],
  },
  locations: {
    title: 'Popular Locations',
    links: [
      { label: 'New York City', href: '/businesses?location=new-york' },
      { label: 'Los Angeles', href: '/businesses?location=los-angeles' },
      { label: 'Austin', href: '/businesses?location=austin' },
      { label: 'Miami', href: '/businesses?location=miami' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press', href: '/press' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Report an Issue', href: '/report' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to fetch site settings:', err));
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {settings?.newsletterTitle || 'Stay updated'}
              </h3>
              <p className="text-gray-400">
                {settings?.newsletterDesc || 'Get the latest business listings and updates delivered to your inbox.'}
              </p>
            </div>
            <div>
              <form className="flex gap-3" onSubmit={(e) => { e.preventDefault(); }}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#0a897d]"
                />
                <Button className="bg-[#0a897d] hover:bg-[#0a897d]/90 text-white">
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo />
              <span className="text-xl font-bold text-white">
                {settings?.siteName || 'IndexOrbit'}
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              {settings?.footerBrandDesc || 'Discover local businesses with AI-powered search.'}
            </p>

            {/* Contact Info */}
            {settings?.contactEmail && (
              <div className="space-y-2 text-sm">
                {settings.contactEmail && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                      {settings.contactEmail}
                    </a>
                  </div>
                )}
                {settings.contactPhone && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${settings.contactPhone}`} className="hover:text-white transition-colors">
                      {settings.contactPhone}
                    </a>
                  </div>
                )}
                {settings.contactAddress && (
                  <div className="flex items-start gap-2 text-gray-400">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{settings.contactAddress}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0a897d] transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {Object.entries(footerNavigation).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {settings?.siteName || 'IndexOrbit'}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
