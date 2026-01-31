'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: "How fast are trades executed?",
      answer: "Trades are executed in milliseconds. We use high-speed infrastructure to ensure minimal slippage and the best possible entry points for your positions."
    },
    {
      question: "How do I deposit funds?",
      answer: "You can deposit funds via bank transfer, credit card, or supported cryptocurrencies. Visit the deposit section in your dashboard for all available methods."
    },
    {
      question: "What is the minimum withdrawal amount?",
      answer: "The minimum withdrawal amount is $50. Withdrawals are processed within 24 hours on business days."
    },
    {
      question: "Do you offer risk management tools?",
      answer: "Yes, we provide advanced Stop Loss and Take Profit features, along with real-time risk analysis on your dashboard."
    },
    {
      question: "How do I integrate via API?",
      answer: "We provide comprehensive REST API documentation for automated trading. Visit the Docs page for endpoints and authentication keys."
    },
    {
      question: "Is my capital secure?",
      answer: "We use segregated accounts and multi-layer encryption to protect user funds and personal data."
    },
    {
      question: "What markets are available?",
      answer: "You can trade major Forex pairs, leading Cryptocurrencies, and Global Indices 24/7."
    },
    {
      question: "Can I use multiple accounts?",
      answer: "Each verified user is permitted one primary account for security and compliance reasons. Contact support for institutional needs."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support form submitted:', contactForm);
    // Handle form submission
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              How can we{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                help you?
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get help with trades, deposits, API integration, and account security
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Support Options */}
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Methods */}
              <div className="glass-effect rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Contact Us</h2>
                <div className="space-y-4">
                  <button className="w-full flex items-center space-x-3 p-4 bg-secondary hover:bg-card rounded-lg transition-colors">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </button>

                  <a
                    href="mailto:support@startrader.com"
                    className="w-full flex items-center space-x-3 p-4 bg-secondary hover:bg-card rounded-lg transition-colors"
                  >
                    <Mail className="h-5 w-5 text-green-500" />
                    <div className="text-left">
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@startrader.com</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Support Hours */}
              <div className="glass-effect rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Support Hours</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Live Chat</span>
                    <span className="text-green-500">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Support</span>
                    <span>24-48 hours</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="glass-effect rounded-xl p-6">
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <a href="/services" className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg transition-colors">
                    <span className="text-sm">Browse Services</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                  <a href="/docs" className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg transition-colors">
                    <span className="text-sm">Docs (Quick)</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                  <a href="https://ssmagency.xpouch.co/docs/api#/" className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg transition-colors">
                    <span className="text-sm">Docs (Full API)</span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Search FAQ */}
              <div className="glass-effect rounded-xl p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* FAQ Section */}
              <div className="glass-effect rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-border rounded-lg">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary transition-colors"
                      >
                        <span className="font-medium">{faq.question}</span>
                        {openFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      {openFaq === index && (
                        <div className="px-4 pb-4">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="glass-effect rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Issue</option>
                      <option value="service">Service Question</option>
                      <option value="api">API Integration</option>
                      <option value="account">Account Problem</option>
                      <option value="billing">Billing Question</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={5}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Please describe your issue in detail..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent text-white rounded-lg py-3 font-semibold hover:scale-105 transition-transform duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SupportPage;