'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Mail, KeyRound, CheckCircle } from 'lucide-react';
import { apiPostJson } from '@/lib/api';

type Step = 'email' | 'verify' | 'reset';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await apiPostJson<any>('/otp/password-reset/send', {
        email,
      });

      if (res?.success) {
        setSuccess(res?.message || 'OTP sent to your email. Please check your inbox.');
        setTimeout(() => {
          setStep('verify');
          setSuccess(null);
        }, 2000);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await apiPostJson<any>('/otp/verify', {
        email,
        otp,
      });

      if (res?.success) {
        setSuccess(res?.message || 'OTP verified successfully.');
        setTimeout(() => {
          setStep('reset');
          setSuccess(null);
        }, 2000);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiPostJson<any>('/password-reset', {
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (res?.success || res?.message) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              {step === 'email' && 'Enter your email to receive a verification code.'}
              {step === 'verify' && 'Enter the verification code sent to your email.'}
              {step === 'reset' && 'Enter your new password.'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step === 'email' ? 'bg-primary border-primary text-white' : 
                  step === 'verify' || step === 'reset' ? 'bg-primary border-primary text-white' : 
                  'border-border text-muted-foreground'
                }`}>
                  {step !== 'email' ? <CheckCircle className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                </div>
                <span className={`ml-2 text-sm ${step === 'email' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Email
                </span>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${step === 'verify' || step === 'reset' ? 'bg-primary' : 'bg-border'}`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step === 'verify' ? 'bg-primary border-primary text-white' : 
                  step === 'reset' ? 'bg-primary border-primary text-white' : 
                  'border-border text-muted-foreground'
                }`}>
                  {step === 'reset' ? <CheckCircle className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
                </div>
                <span className={`ml-2 text-sm ${step === 'verify' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Verify
                </span>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${step === 'reset' ? 'bg-primary' : 'bg-border'}`}></div>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step === 'reset' ? 'bg-primary border-primary text-white' : 'border-border text-muted-foreground'
                }`}>
                  <KeyRound className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm ${step === 'reset' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Reset
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-effect rounded-2xl p-8">
            {(error || success) && (
              <div
                className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
                  error
                    ? 'border-red-500/30 bg-red-500/10 text-red-200'
                    : 'border-green-500/30 bg-green-500/10 text-green-200'
                }`}
              >
                {error ?? success}
              </div>
            )}

            {/* Step 1: Email */}
            {step === 'email' && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white rounded-lg py-3 font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === 'verify' && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enter the 6-digit code sent to {email}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtp('');
                      setError(null);
                    }}
                    className="flex-1 bg-secondary text-foreground rounded-lg py-3 font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-white rounded-lg py-3 font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('verify');
                      setPassword('');
                      setConfirmPassword('');
                      setError(null);
                    }}
                    className="flex-1 bg-secondary text-foreground rounded-lg py-3 font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-white rounded-lg py-3 font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

