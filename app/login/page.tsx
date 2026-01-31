'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Eye, EyeOff } from 'lucide-react';
import { apiPostJson } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { login } from '@/lib/store/authSlice';

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      console.log('Sending login request...');
      const res = await apiPostJson<any>('', {
        email: formData.email,
        password: formData.password,
      }, { action: 'login' });

      console.log('Login response:', res);

      if (res.success && res.user) {
        console.log('Login successful, user:', res.user);
        // Dispatch Redux action
        dispatch(login({
          token: res.user.id.toString(), // Using user ID as a simple token for now
          user: {
            id: parseInt(res.user.id), // Parse ID as number
            email: res.user.email,
            full_name: res.user.full_name,
            balance: parseFloat(res.user.balance), // Parse balance as number
            role: res.user.role
          },
          rememberMe: formData.rememberMe
        }));

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.error('Login failed:', res);
        setError(res.error || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 px-3 sm:px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Sign in to your account to continue</p>
          </div>

          {/* Login Form */}
          <div className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
            {error && (
              <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter your password"
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-4 h-4 text-primary bg-secondary border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-accent transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary to-accent text-white rounded-lg py-3 font-semibold hover:scale-105 transition-transform duration-300"
              >
                {submitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-primary hover:text-accent transition-colors font-semibold"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;