'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Eye, EyeOff, Check } from 'lucide-react';
import { apiPostJson } from '@/lib/api';

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.agreeToTerms) {
      setError('Please accept the Terms and Privacy Policy to continue.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await apiPostJson('', {
        full_name: formData.username, // Using username as full name for now or add a full name field
        email: formData.email,
        password: formData.password
      }, { action: 'register' });

      setSuccess('Account created successfully. Redirecting to login…');
      setTimeout(() => router.push('/login'), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Get access to fast, affordable social media boosting services</p>
          </div>

          {/* Signup Form */}
          <div className="glass-effect rounded-2xl p-8">
            {(error || success) && (
              <div
                className={`mb-6 rounded-lg border px-4 py-3 text-sm ${error
                    ? 'border-red-500/30 bg-red-500/10 text-red-200'
                    : 'border-green-500/30 bg-green-500/10 text-green-200'
                  }`}
              >
                {error ?? success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Choose a username"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className={`h-4 w-4 ${req.met ? 'text-green-500' : 'text-muted-foreground'}`} />
                        <span className={`text-sm ${req.met ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">Passwords do not match</p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="w-4 h-4 text-primary bg-secondary border-border rounded focus:ring-primary focus:ring-2 mt-0.5"
                    required
                  />
                  <span className="text-sm text-muted-foreground">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:text-accent">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:text-accent">Privacy Policy</Link>
                  </span>
                </label>


              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !formData.agreeToTerms || formData.password !== formData.confirmPassword}
                className="w-full bg-gradient-to-r from-primary to-accent text-white rounded-lg py-3 font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary hover:text-accent transition-colors font-semibold"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;