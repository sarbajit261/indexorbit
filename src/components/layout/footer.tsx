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
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useState, useEffect } from 'react';

interface SiteSettings {
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  socialTwitter: string | null;
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialLinkedin: string | null;
  siteName: string;
  footerBrandDesc: string | null;
}

const footerNavigation = {
  discover: {
    title: 'Discover',
    links: [
      { label: 'All Businesses', href: '/businesses' },
      { label: 'Restaurants', href: '/business-category/restaurants' },
      { label: 'Shopping', href: '/business-category/shopping' },
      { label: 'Beauty', href: '/business-category/beauty' },
      { label: 'Fitness', href: '/business-category/fitness' },
    ],
  },
  locations: {
    title: 'Popular Locations',
    links: [
      { label: 'New York City', href: '/location/new-york-city' },
      { label: 'Los Angeles', href: '/location/los-angeles' },
      { label: 'Chicago', href: '/location/chicago' },
      { label: 'Houston', href: '/location/houston' },
      { label: 'Miami', href: '/location/miami' },
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
      { label: 'Safety Center', href: '/safety' },
      { label: 'Community Guidelines', href: '/guidelines' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
};

const socialLinks = [
  { label: 'Twitter', href: '/', icon: Twitter },
  { label: 'Facebook', href: '/', icon: Facebook },
  { label: 'Instagram', href: '/', icon: Instagram },
  { label: 'LinkedIn', href: '/', icon: Linkedin },
];

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top row: Left (Logo + Desc + Contact + Social) + Nav columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-4">
            <Logo className="h-12 w-auto" />
            <p className="text-sm text-gray-500 leading-relaxed">
              {settings?.footerBrandDesc ||
                'Discover local businesses with AI-powered search. Find restaurants, hotels, shops, service providers, and more in your area.'}
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <a href={`mailto:${settings?.contactEmail || 'hello@indexorbit.com'}`} className="flex items-center gap-2 hover:text-[#0a897d] transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0" />
                {settings?.contactEmail || 'hello@indexorbit.com'}
              </a>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                {settings?.contactPhone || '+1 (555) 123-4567'}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {settings?.contactAddress || '123 Business Ave, Suite 100, San Francisco, CA 94102'}
              </span>
            </div>
            <div className="flex gap-3 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-[#0a897d] hover:bg-gray-200 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns - right side */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {Object.entries(footerNavigation).map(([key, section]) => (
                <div key={key}>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-gray-500 hover:text-[#0a897d] transition-colors"
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {settings?.siteName || 'IndexOrbit'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-[#0a897d] transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#0a897d] transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="hover:text-[#0a897d] transition-colors">
              Cookies
            </Link>
            <Link href="/accessibility" className="hover:text-[#0a897d] transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
