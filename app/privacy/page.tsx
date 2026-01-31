'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Privacy{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 1, 2025
            </p>
          </div>

          {/* Content */}
          <div className="glass-effect rounded-2xl p-8 prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, place an order,
                or contact us for support. This may include:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Personal identification information (name, email, phone number)</li>
                <li>Identity verification documents</li>
                <li>Order information and service usage history</li>
                <li>Device and usage information</li>
                <li>Communication records</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process orders and send related information</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Send you technical notices and support messages</li>
                <li>Communicate with you about products, services, and promotional offers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described below:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>With service providers who assist us in operating our platform</li>
                <li>When required by law or to respond to legal process</li>
                <li>To protect our rights, property, or safety, or that of our users</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>256-bit SSL encryption for data transmission</li>
                <li>Multi-factor authentication</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and employee training</li>
                <li>Secure data storage and backup procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. 
                When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Right to access and receive a copy of your personal information</li>
                <li>Right to rectify inaccurate or incomplete information</li>
                <li>Right to erase your personal information</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to data portability</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar tracking technologies to collect information about your browsing activities. 
                This helps us improve our services and provide a better user experience. You can control cookie settings through your browser.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. International Transfers</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children. 
                If we learn that we have collected information from a child, we will delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page 
                and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-foreground"><strong>Email:</strong> privacy@ssmagency.com</p>
                <p className="text-foreground"><strong>Data Protection Officer:</strong> dpo@ssmagency.com</p>
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

export default PrivacyPage;