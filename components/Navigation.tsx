'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { LogoutModal } from '@/components/LogoutModal';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { logout } from '@/lib/store/authSlice';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
    setIsOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/exchange', label: 'Exchange' },
    { href: '/about', label: 'About' },
    { href: '/support', label: 'Support' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">
          {/* Text Logo - Stylized */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  STAR
                </span>
                <span className="text-foreground">TRADER</span>
              </h1>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block flex-1">
            <div className="ml-4 xl:ml-10 flex items-baseline space-x-2 xl:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-all duration-300 hover:scale-105 ${pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side: Theme Toggle + Auth Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="inline-flex items-center px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <LogOut className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3 xl:px-4 py-2 text-xs xl:text-sm bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:scale-105 transition-transform duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200"
            >
              {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden glass-effect">
          <div className="px-3 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors duration-200 ${pathname === item.href
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2.5 rounded-md text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setIsOpen(false);
                    }}
                    className="w-full text-left block px-3 py-2.5 mt-2 rounded-md text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <span className="inline-flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2.5 rounded-md text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2.5 mt-2 bg-gradient-to-r from-primary to-accent text-white rounded-md text-sm sm:text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default Navigation;