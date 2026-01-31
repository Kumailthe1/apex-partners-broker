'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import Link from 'next/link';
import { PlusCircle, ShoppingBag, Wallet, MessageSquare, Grid3x3, ArrowRight, Loader2, Copy, Check, History } from 'lucide-react';
import { TransactionTable, Transaction } from '@/components/TransactionTable';
import { apiPostJson } from '@/lib/api';

const DashboardPage = () => {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTx, setIsLoadingTx] = useState(true);

  useEffect(() => {
    // Wait a bit for rehydration to complete
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id || !token) return;
      try {
        const res = await apiPostJson<{ success: boolean; transactions: Transaction[] }>(
          '',
          { user_id: user.id },
          { action: 'get_transactions', token }
        );
        if (res.success) {
          setTransactions(res.transactions);
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setIsLoadingTx(false);
      }
    };

    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [user?.id, token, isAuthenticated]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin-ease-out" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const quickActions = [
    { href: '/exchange', label: 'Trade Now', icon: PlusCircle, color: 'from-blue-500 to-cyan-500' },
    { href: '/dashboard/deposit', label: 'Deposit', icon: Wallet, color: 'from-green-500 to-emerald-500' },
    { href: '/dashboard/transactions', label: 'Activity', icon: History, color: 'from-orange-500 to-amber-500' },
    { href: '/dashboard/withdraw', label: 'Withdraw', icon: ShoppingBag, color: 'from-purple-500 to-pink-500' },
    { href: '/support', label: 'Support', icon: MessageSquare, color: 'from-blue-500 to-indigo-500' },
  ];

  const balance = Number(user?.balance ?? 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mt-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            <span className="block sm:inline">Welcome back</span>
            {user?.full_name ? (
              <>
                <span className="hidden sm:inline">, </span>
                <span className="block sm:inline">{user.full_name}!</span>
              </>
            ) : user?.email ? (
              <>
                <span className="hidden sm:inline">, </span>
                <span className="block sm:inline">{user.email.split('@')[0]}</span>
              </>
            ) : null}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Your gateway to global financial markets
          </p>
        </div>

        {/* Balance Card */}
        <div className="mb-6 sm:mb-8 glass-effect rounded-xl p-5 sm:p-8 border border-border bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Available Balance</p>
              <p className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <Wallet className="h-10 w-10 sm:h-16 sm:w-16 text-primary/50" />
          </div>
          <div className="mt-5 sm:mt-6 flex gap-3">
            <Link
              href="/dashboard/deposit"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg py-2.5 sm:py-3 px-4 text-sm sm:text-base font-semibold hover:scale-105 transition-transform duration-300 text-center"
            >
              Deposit
            </Link>
            <Link
              href="/dashboard/withdraw"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg py-2.5 sm:py-3 px-4 text-sm sm:text-base font-semibold hover:scale-105 transition-transform duration-300 text-center"
            >
              Withdraw
            </Link>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="glass-effect rounded-xl p-4 sm:p-6 hover:scale-105 transition-transform duration-200 group"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${action.color} mb-3 sm:mb-4`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">{action.label}</h3>
                <div className="flex items-center text-[10px] sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Start</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="glass-effect rounded-xl p-5 sm:p-6">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Total Deposits</p>
            <p className="text-xl sm:text-3xl font-bold text-foreground">$0.00</p>
          </div>
          <div className="glass-effect rounded-xl p-5 sm:p-6">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Total Withdrawals</p>
            <p className="text-xl sm:text-3xl font-bold text-foreground">$0.00</p>
          </div>
          <div className="glass-effect rounded-xl p-5 sm:p-6">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Profit/Loss</p>
            <p className="text-xl sm:text-3xl font-bold text-green-500">+$0.00</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

