'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { apiPostJson } from '@/lib/api';
import { Wallet, CreditCard, Building2, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const WithdrawPage = () => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState<'card' | 'bank' | 'crypto'>('bank');
    const [accountDetails, setAccountDetails] = useState('');

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

        const withdrawAmount = parseFloat(amount);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (withdrawAmount < 10) {
            setError('Minimum withdrawal amount is $10');
            return;
        }

        const balance = user?.balance ?? 0;
        if (withdrawAmount > balance) {
            setError(`Insufficient balance. Available: $${balance.toFixed(2)}`);
            return;
        }

        if (!accountDetails.trim()) {
            setError('Please provide your account details');
            return;
        }

        setSubmitting(true);
        try {
            const res = await apiPostJson<any>('', {
                user_id: user?.id,
                amount: withdrawAmount,
                withdraw_method: withdrawMethod,
                account_details: accountDetails
            }, { action: 'withdraw' });

            if (res.success) {
                setSuccess('Withdrawal request submitted successfully! Funds will be processed within 24-48 hours.');
                setAmount('');
                setAccountDetails('');
                setTimeout(() => router.push('/dashboard'), 2000);
            } else {
                setError(res.error || 'Failed to submit withdrawal request');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit withdrawal request');
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

    const balance = user?.balance ?? 0;
    const quickAmounts = [50, 100, 500, 1000].filter(amt => amt <= balance);

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
                    <h1 className="text-3xl font-bold mb-2">Withdraw Funds</h1>
                    <p className="text-muted-foreground">Request a withdrawal from your trading account</p>
                </div>

                {/* Balance Display */}
                <div className="glass-effect rounded-xl p-6 mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
                    <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                    <p className="text-3xl font-bold text-foreground">${balance.toFixed(2)}</p>
                </div>

                {/* Withdrawal Form */}
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
                                Withdrawal Amount (USD)
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
                                    max={balance}
                                    step="0.01"
                                    required
                                />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Minimum: $10 | Maximum: ${balance.toFixed(2)}
                            </p>
                        </div>

                        {/* Quick Amount Buttons */}
                        {quickAmounts.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-3">Quick Select</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                                    {balance >= 10 && (
                                        <button
                                            type="button"
                                            onClick={() => setAmount(balance.toString())}
                                            className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-sm font-medium transition-colors"
                                        >
                                            All
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Withdrawal Method */}
                        <div>
                            <label className="block text-sm font-medium mb-3">Withdrawal Method</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setWithdrawMethod('bank')}
                                    className={`p-4 rounded-lg border-2 transition-all ${withdrawMethod === 'bank'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-secondary hover:border-border/50'
                                        }`}
                                >
                                    <Building2 className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">Bank Transfer</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setWithdrawMethod('card')}
                                    className={`p-4 rounded-lg border-2 transition-all ${withdrawMethod === 'card'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-secondary hover:border-border/50'
                                        }`}
                                >
                                    <CreditCard className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">Card</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setWithdrawMethod('crypto')}
                                    className={`p-4 rounded-lg border-2 transition-all ${withdrawMethod === 'crypto'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-secondary hover:border-border/50'
                                        }`}
                                >
                                    <Wallet className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm font-medium">Crypto</p>
                                </button>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div>
                            <label htmlFor="accountDetails" className="block text-sm font-medium mb-2">
                                {withdrawMethod === 'bank' && 'Bank Account Details'}
                                {withdrawMethod === 'card' && 'Card Details'}
                                {withdrawMethod === 'crypto' && 'Wallet Address'}
                            </label>
                            <textarea
                                id="accountDetails"
                                value={accountDetails}
                                onChange={(e) => setAccountDetails(e.target.value)}
                                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                                placeholder={
                                    withdrawMethod === 'bank'
                                        ? 'Bank Name, Account Number, Routing Number, etc.'
                                        : withdrawMethod === 'card'
                                            ? 'Card Number (last 4 digits), Cardholder Name'
                                            : 'Your crypto wallet address'
                                }
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting || !amount || balance < 10}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg py-3 font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                'Submit Withdrawal Request'
                            )}
                        </button>
                    </form>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-yellow-200">
                                <p className="font-semibold mb-1">Important Information:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Withdrawals are processed within 24-48 hours</li>
                                    <li>Minimum withdrawal amount is $10</li>
                                    <li>Ensure your account details are correct to avoid delays</li>
                                    <li>You will receive a confirmation email once processed</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WithdrawPage;
