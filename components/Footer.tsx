'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  STAR
                </span>
                <span className="text-foreground">TRADER</span>
              </h2>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Accurate Forex & Crypto signals with smart risk management. Consistent growth, not promises. Trade London & New York sessions with clarity & discipline.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4">Trading</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link href="/exchange" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Exchange</Link></li>
              <li><Link href="/dashboard" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/support" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link href="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/support" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link href="/terms" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Risk Disclosure</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2026 STARTRADER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;