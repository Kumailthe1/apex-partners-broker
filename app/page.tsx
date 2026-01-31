'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAppSelector } from '@/lib/store/hooks';
import {
  ArrowRight,
  Zap,
  CheckCircle,
  Timer,
  BadgeDollarSign,
  Layers,
  Headset,
  LayoutDashboard,
  Rocket,
  TrendingUp,
  WalletCards,
  Landmark,
  ShieldCheck,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Lock
} from 'lucide-react';

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState({ users: 0, transactions: 0, volume: 0 });

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Animate counters
  useEffect(() => {
    const animateCounter = (target: number, setter: (value: number) => void) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 50);
    };

    setTimeout(() => animateCounter(15_000, (value) => setStats((prev) => ({ ...prev, users: value }))), 500);
    setTimeout(() => animateCounter(100_000, (value) => setStats((prev) => ({ ...prev, transactions: value }))), 800);
    setTimeout(() => animateCounter(50_000_000, (value) => setStats((prev) => ({ ...prev, volume: value }))), 900);
  }, []);

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Accurate Signals',
      description: 'Precise Forex & Crypto signals backed by professional analysis and proven strategies.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: 'Smart Risk Management',
      description: 'Protect your capital with intelligent risk controls and position sizing.',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Consistent Growth',
      description: 'Focus on sustainable profits, not unrealistic promises. Real results, real growth.',
    },
    {
      icon: <Headset className="h-8 w-8" />,
      title: 'Session Trading',
      description: 'Optimized for London & New York sessions with clarity & discipline.',
    },
  ];

  const howItWorksSteps = [
    { step: '1', title: 'Register', description: 'Create your account in under 2 minutes.' },
    { step: '2', title: 'Get Signals', description: 'Receive accurate Forex & Crypto trading signals.' },
    { step: '3', title: 'Manage Risk', description: 'Follow our smart risk management guidelines.' },
    { step: '4', title: 'Trade Sessions', description: 'Execute trades during London & New York sessions.' },
    { step: '5', title: 'Track Growth', description: 'Monitor your consistent, sustainable growth.' },
    { step: '6', title: 'Withdraw Profits', description: 'Access your earnings anytime, hassle-free.' },
  ];

  const tradingInstruments = [
    { icon: <Globe className="h-5 w-5" />, title: 'Forex', items: ['EUR/USD', 'GBP/JPY', 'AUD/CAD', 'USD/CHF'] },
    { icon: <Lock className="h-5 w-5" />, title: 'Crypto', items: ['Bitcoin', 'Ethereum', 'Solana', 'USDT'] },
    { icon: <BarChart3 className="h-5 w-5" />, title: 'Stocks', items: ['Apple', 'Tesla', 'Amazon', 'Google'] },
    { icon: <PieChart className="h-5 w-5" />, title: 'Indices', items: ['S&P 500', 'NASDAQ', 'DOW JONES', 'DAX'] },
    { icon: <Layers className="h-5 w-5" />, title: 'Commodities', items: ['Gold', 'Silver', 'Oil', 'Natural Gas'] },
    { icon: <LineChart className="h-5 w-5" />, title: 'More', items: ['ETFs', 'Mutual Funds', 'Options', 'Futures'] },
  ];

  const testimonials = [
    { quote: 'The signals are incredibly accurate. My trading has improved dramatically with their risk management approach.', name: 'Michael O.', role: 'FOREX TRADER' },
    { quote: 'Finally, a platform that delivers consistent growth instead of empty promises. Highly recommended!', name: 'Sarah L.', role: 'CRYPTO INVESTOR' },
    { quote: 'Trading London and New York sessions with their signals has been a game-changer for my portfolio.', name: 'James K.', role: 'DAY TRADER' },
  ];

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 px-3 sm:px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="animate-slide-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Trade with {' '}<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Clarity & Discipline
                </span>
              </h1>
              <div className="space-y-3 mb-6 sm:mb-8">
                <p className="text-base sm:text-lg md:text-xl text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Accurate Forex & Crypto signals</span>
                </p>
                <p className="text-base sm:text-lg md:text-xl text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Smart risk management</span>
                </p>
                <p className="text-base sm:text-lg md:text-xl text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Consistent growth, not promises</span>
                </p>
                <p className="text-base sm:text-lg text-muted-foreground mt-4">
                  London & New York sessions
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-black rounded-lg text-sm sm:text-base font-bold hover:scale-105 transition-transform duration-300 flex items-center justify-center group"
                >
                  Start Trading Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/exchange"
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary rounded-lg text-sm sm:text-base font-semibold hover:bg-primary/10 transition-colors duration-300 text-center"
                >
                  View Live Charts
                </Link>
              </div>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span>Verified Signals</span>
                </div>
                <div className="hidden sm:block text-muted-foreground/50">•</div>
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span>Secure Platform</span>
                </div>
                <div className="hidden sm:block text-muted-foreground/50">•</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span>Proven Results</span>
                </div>
              </div>
            </div>

            <div className="animate-slide-right relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-float border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-semibold">Live Market Signals</h3>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-muted-foreground">EUR/USD</span>
                      <span className="font-mono text-sm sm:text-lg text-primary">1.0845 ▲</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-muted-foreground">BTC/USD</span>
                      <span className="font-mono text-sm sm:text-lg text-primary">$94,250.00 ▲</span>
                    </div>
                    <div className="w-full bg-primary/20 rounded-full h-1.5 sm:h-2">
                      <div className="bg-gradient-to-r from-primary to-accent h-1.5 sm:h-2 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Professional analysis • Real-time updates • Session alerts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="animate-fade-up">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {stats.users.toLocaleString()}+
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Active Traders</p>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {stats.transactions.toLocaleString()}+
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Transactions</p>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                ${(stats.volume / 1_000_000).toFixed(0)}M+
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Trading Volume</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">STARTRADER</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              We provide the tools and support you need to trade successfully in today's global markets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-effect rounded-xl p-4 sm:p-6 hover:scale-105 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-3 sm:mb-4 text-white">
                  <div className="scale-75 sm:scale-100">{feature.icon}</div>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Get Started in 6 Simple Steps</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <span className="text-white font-bold text-base sm:text-xl">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instruments */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Trade More Than 200+ Assets</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Diversify your portfolio across various global markets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tradingInstruments.map((instrument, index) => (
              <div
                key={index}
                className="glass-effect rounded-xl p-4 sm:p-6 hover:scale-[1.02] transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center text-white">
                    <div className="scale-75 sm:scale-100">{instrument.icon}</div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold">{instrument.title}</h3>
                </div>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5 sm:space-y-2">
                  {instrument.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Voices of Success</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
                <div className="mt-4 sm:mt-5 border-t border-border pt-3 sm:pt-4">
                  <p className="text-sm sm:text-base font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;