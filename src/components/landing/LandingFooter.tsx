import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const LandingFooter: React.FC = () => {
  const quickLinks = [
    { label: 'Home', href: '#' },
    { label: 'About Us', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  const resources = [
    { label: 'Parent Guide', href: '#' },
    { label: 'Teacher Resources', href: '#' },
    { label: 'FAQs', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Support', href: '#' },
  ];

  const legal = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <span className="text-xl font-bold">FunQuest Learn</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Making early learning fun and accessible for every child. Trusted by parents and schools across Uganda and beyond.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:hello@funquestlearn.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>hello@funquestlearn.com</span>
              </a>
              <a href="tel:+256700000000" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>+256 700 000 000</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Kampala, Uganda</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get tips and updates on your child's learning journey.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} FunQuest Books. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4">
              {legal.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
