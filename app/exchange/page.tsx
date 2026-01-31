'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { TradingChart } from '@/components/TradingChart';
import { Loader2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const ExchangePage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const balance = Number(user?.balance ?? 0);

  const popularPairs = [
    { symbol: 'BTC/USD', price: '43,250.00', change: '+2.45%', isPositive: true },
    { symbol: 'ETH/USD', price: '2,280.50', change: '+1.82%', isPositive: true },
    { symbol: 'EUR/USD', price: '1.0845', change: '-0.15%', isPositive: false },
    { symbol: 'GBP/USD', price: '1.2650', change: '+0.32%', isPositive: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 sm:pt-24 md:pt-28 pb-12 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Trading Exchange</h1>
            <p className="text-muted-foreground">
              Real-time market data and advanced charting tools
            </p>
          </div>

          {/* Balance Card */}
          <div className="glass-effect rounded-xl p-4 sm:p-6 mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-10 w-10 sm:h-12 sm:w-12 text-primary/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-3">
              <div className="glass-effect rounded-xl p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Live Chart</h2>
                <TradingChart />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Popular Pairs */}
              <div className="glass-effect rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Popular Pairs</h3>
                <div className="space-y-3">
                  {popularPairs.map((pair) => (
                    <div
                      key={pair.symbol}
                      className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{pair.symbol}</span>
                        {pair.isPositive ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-semibold">${pair.price}</span>
                        <span
                          className={`text-xs font-medium ${pair.isPositive ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                          {pair.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-effect rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/dashboard/deposit')}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg py-2.5 px-4 font-medium hover:scale-105 transition-transform duration-300"
                  >
                    Deposit Funds
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/withdraw')}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg py-2.5 px-4 font-medium hover:scale-105 transition-transform duration-300"
                  >
                    Withdraw Funds
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-secondary hover:bg-secondary/80 text-foreground rounded-lg py-2.5 px-4 font-medium transition-colors"
                  >
                    Dashboard
                  </button>
                </div>
              </div>

              {/* Market Info */}
              <div className="glass-effect rounded-xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-3">Market Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-500 font-medium">● Open</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h Volume:</span>
                    <span className="font-medium">$2.4B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Traders:</span>
                    <span className="font-medium">12,450</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExchangePage;