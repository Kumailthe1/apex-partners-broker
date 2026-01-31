'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/useAuth';
import { DashboardLayout } from '@/components/DashboardLayout';
import { History, Loader2 } from 'lucide-react';
import { TransactionTable, Transaction } from '@/components/TransactionTable';
import { apiPostJson } from '@/lib/api';

const TransactionsPage = () => {
    const router = useRouter();
    const { isAuthenticated, user, token } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingTx, setIsLoadingTx] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsChecking(false);
            if (!isAuthenticated) {
                router.push('/login');
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user?.id || !token) return;
            try {
                const res = await apiPostJson<{ success: boolean; transactions: Transaction[] }>(
                    '',
                    { user_id: user.id },
                    { action: 'get_transactions', token }
                );
                if (res.success) {
                    setTransactions(res.transactions);
                }
            } catch (err) {
                console.error('Failed to fetch transactions:', err);
            } finally {
                setIsLoadingTx(false);
            }
        };

        if (isAuthenticated) {
            fetchTransactions();
        }
    }, [user?.id, token, isAuthenticated]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin-ease-out" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
                    <p className="text-muted-foreground">
                        View and track all your account activities
                    </p>
                </div>

                <div className="glass-effect rounded-xl p-4 sm:p-6 border border-border">
                    <div className="flex items-center space-x-2 mb-6 text-primary">
                        <History className="h-6 w-6" />
                        <h2 className="text-xl font-bold text-foreground">All Transactions</h2>
                    </div>

                    {isLoadingTx ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            <p className="text-sm text-muted-foreground">Loading transactions...</p>
                        </div>
                    ) : (
                        <TransactionTable transactions={transactions} />
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TransactionsPage;
