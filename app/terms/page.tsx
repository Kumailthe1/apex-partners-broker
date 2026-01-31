'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Terms of{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 1, 2025
            </p>
          </div>

          {/* Content */}
          <div className="glass-effect rounded-2xl p-8 prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using SMM Agency’s services, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SMM Agency provides a Social Media Marketing (SMM) panel platform. Our platform allows users to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Browse SMM services (followers, likes, views, etc.)</li>
                <li>Place and track orders using service forms</li>
                <li>Access order history and account information</li>
                <li>Use API endpoints where available for integrations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a user of SMM Agency, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use the service for any illegal or fraudulent activities</li>
                <li>Report any suspicious activity or security breaches immediately</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Account Verification</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To ensure security and regulatory compliance, we may require identity verification. This may include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Government-issued identification documents</li>
                <li>Proof of address</li>
                <li>Additional documentation as required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Fees and Charges</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SMM Agency charges for certain services. All applicable prices are displayed before you place an order.
                We reserve the right to modify our fee structure with 30 days' notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. Transaction Limits</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Limits may apply based on your account status and risk controls. These limits may be adjusted to protect the platform and users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Prohibited Activities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may not use SMM Agency for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Illegal activities or policy violations</li>
                <li>Attempting to abuse, reverse engineer, or disrupt the platform</li>
                <li>Fraudulent orders or providing links you don’t control (where applicable)</li>
                <li>Creating multiple accounts to bypass restrictions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Risk Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Service delivery times and results can vary by platform and service type. Please review each service description carefully before ordering.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Privacy and Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                use, and protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">10. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SMM Agency shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">11. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your account at any time for violation of these terms or for any other reason. 
                Upon termination, your right to use the service will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">12. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email 
                or through our platform. Continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">13. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-foreground"><strong>Email:</strong> legal@ssmagency.com</p>
                <p className="text-foreground"><strong>Address:</strong> SMM Agency</p>
                <p className="text-foreground"><strong>Phone:</strong> +234 123 456 7890</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;