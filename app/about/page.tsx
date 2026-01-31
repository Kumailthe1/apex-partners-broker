'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Shield, TrendingUp, Globe, Award, Target, Zap } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security & Trust",
      description: "Priority protection for your capital and data with industry-leading security protocols."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Market Precision",
      description: "Access real-time data and execution speeds designed for serious traders."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Markets",
      description: "Trade Forex, Crypto, and Commodities across international markets from one platform."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "Dedicated to providing the most reliable and transparent brokerage experience."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">
              About{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                STARTRADER
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering traders with accurate signals, advanced tools, and a secure environment for consistent growth in the global markets.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="glass-effect rounded-2xl p-8 mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  STARTRADER was established to bridge the gap between complex market dynamics and retail traders. We believe that clarity and discipline are the keys to long-term success.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Our platform provides the critical infrastructure needed to execute trades with confidence, backed by real-time analytics and professional-grade charting tools.
                </p>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Goal:</span>
                  <span>To be the world's most transparent and reliable trading partner.</span>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/images/about-hero.png"
                  alt="Trading Vision Headquarters"
                  className="rounded-xl w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="glass-effect rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">STARTRADER by the Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  $2.4B+
                </div>
                <p className="text-muted-foreground">Daily Trading Volume</p>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <p className="text-muted-foreground">Market Access</p>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  &lt;10ms
                </div>
                <p className="text-muted-foreground">Execution Speed</p>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  50k+
                </div>
                <p className="text-muted-foreground">Active Traders</p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="glass-effect rounded-2xl p-8 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                What started as a small team of passionate institutional traders has grown into a global platform serving thousands of clients. We saw the need for a brokerage that puts the trader first.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our evolution has been driven by technology and a commitment to transparency. We've continuously upgraded our infrastructure to ensure our clients have every advantage in the market.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, STARTRADER is synonymous with clarity, discipline, and professional-grade performance in the world of online trading.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Trade with Clarity?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Open your professional trading account today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:scale-105 transition-transform duration-300">
                Open Account
              </button>
              <button className="px-8 py-4 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors duration-300">
                View Markets
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;