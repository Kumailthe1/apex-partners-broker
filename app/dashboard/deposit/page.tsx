'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { apiPostJson } from '@/lib/api';
import { Wallet, CreditCard, Building2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const DepositPage = () => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'crypto'>('card');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsChecking(false);
            if (!isAuthenticated) {
                router.push('/login');
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (depositAmount < 10) {
            setError('Minimum deposit amount is $10');
            return;
        }

        setSubmitting(true);
        try {
            const res = await apiPostJson<any>('', {
                user_id: user?.id,
                amount: depositAmount,
                payment_method: paymentMethod
            }, { action: 'deposit' });

            if (res.success) {
                setSuccess('Deposit request submitted successfully! Our team will process it shortly.');
                setAmount('');
                setTimeout(() => router.push('/dashboard'), 2000);
            } else {
                setError(res.error || 'Failed to submit deposit request');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit deposit request');
        } finally {
            setSubmitting(false);
        }
    };

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const quickAmounts = [50, 100, 500, 1000, 5000];

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Deposit Funds</h1>
                    <p className="text-muted-foreground">Add funds to your trading account</p>
                </div>

                {/* Deposit Form */}
                <div className="glass-effect rounded-2xl p-6 sm:p-8">
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
                        {/* Amount Input */}
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium mb-2">
                                Deposit Amount (USD)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">
                                    $
                                </span>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-lg pl-8 pr-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="0.00"
                                    min="10"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">Minimum deposit: $10</p>
                        </div>

                        {/* Quick Amount Buttons */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Quick Select</label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {quickAmounts.map((quickAmount) => (
                                    <button
                                        key={quickAmount}
                                        type="button"
                                        onClick={() => setAmount(quickAmount.toString())}
                                        className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-sm font-medium transition-colors"
                                    >
                                        ${quickAmount}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Payment Method</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-secondary hover:border-border/50'
                                        }`}
                                >
                                    <CreditCard className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">Card</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('bank')}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'bank'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-secondary hover:border-border/50'
                                        }`}
                                >
                                    <Building2 className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">Bank Transfer</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('crypto')}
                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'crypto'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-secondary hover:border-border/50'
                                        }`}
                                >
                                    <Wallet className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">Crypto</p>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting || !amount}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg py-3 font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                'Submit Deposit Request'
                            )}
                        </button>
                    </form>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-200">
                            <strong>Note:</strong> Your deposit will be reviewed and credited to your account within 24 hours.
                            You will receive a confirmation email once processed.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DepositPage;
