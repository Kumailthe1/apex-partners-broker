'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Menu,
  X,
  LogOut,
  Home,
  Shield,
  History
} from 'lucide-react';
import { LogoutModal } from '@/components/LogoutModal';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logout } from '@/lib/store/authSlice';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/exchange', label: 'Exchange', icon: TrendingUp },
  { href: '/dashboard/deposit', label: 'Deposit', icon: ArrowDownToLine },
  { href: '/dashboard/withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
  { href: '/dashboard/transactions', label: 'Transactions', icon: History },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/dashboard" className="flex items-center">
            <h1 className="text-lg font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                STAR
              </span>
              <span className="text-foreground">TRADER</span>
            </h1>
          </Link>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-16">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-16 bottom-0 w-64 glass-effect border-r border-border overflow-y-auto">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-primary to-accent text-black shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${pathname === '/admin'
                    ? 'bg-gradient-to-r from-primary to-accent text-black shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                >
                  <Shield className="h-5 w-5 flex-shrink-0" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <div className="pt-4 mt-4 border-t border-border space-y-2">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                >
                  <Home className="h-5 w-5 flex-shrink-0" />
                  <span>Home</span>
                </Link>
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 glass-effect border-r border-border">
          <div className="p-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-2xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  STAR
                </span>
                <span className="text-foreground">TRADER</span>
              </h1>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-primary to-accent text-black shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${pathname === '/admin'
                  ? 'bg-gradient-to-r from-primary to-accent text-black shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
              >
                <Shield className="h-5 w-5 flex-shrink-0" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>
          <div className="p-4 border-t border-border space-y-2">
            <Link
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
            >
              <Home className="h-5 w-5 flex-shrink-0" />
              <span>Home</span>
            </Link>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between h-16 px-6 glass-effect border-b border-border">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-foreground">
                {menuItems.find(item => item.href === pathname)?.label ||
                  (pathname === '/admin' ? 'Admin Panel' : 'Dashboard')}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-sm text-muted-foreground">
                  Welcome, <span className="text-foreground font-medium">{user.full_name || user.email}</span>
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </div>
  );
}
