'use client';

import React from 'react';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';

export type Transaction = {
    id: number;
    user_id: number;
    type: 'deposit' | 'withdrawal' | 'profit' | 'loss';
    amount: string | number;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    reference: string;
    description: string;
    created_at: string;
};

interface TransactionTableProps {
    transactions: Transaction[];
    isAdmin?: boolean;
    onUpdateStatus?: (id: number, status: Transaction['status']) => void;
}

export function TransactionTable({ transactions, isAdmin, onUpdateStatus }: TransactionTableProps) {
    const getStatusIcon = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'cancelled':
                return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getTypeIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'deposit':
            case 'profit':
                return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
            case 'withdrawal':
            case 'loss':
                return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 glass-effect rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground">No transactions found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {transactions.map((tx) => (
                    <div key={tx.id} className="glass-effect rounded-xl p-4 border border-border/50">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                                {getTypeIcon(tx.type)}
                                <span className="capitalize text-sm font-bold">{tx.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                {getStatusIcon(tx.status)}
                                <span className={`text-xs font-medium capitalize ${tx.status === 'completed' ? 'text-green-500' :
                                        tx.status === 'pending' ? 'text-yellow-500' :
                                            'text-muted-foreground'
                                    }`}>
                                    {tx.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-muted-foreground font-mono mb-1">{tx.reference}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-lg font-black ${tx.type === 'deposit' || tx.type === 'profit' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                    {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {isAdmin && tx.status === 'pending' && (
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => onUpdateStatus?.(tx.id, 'completed')}
                                    className="flex-1 bg-green-500/20 text-green-500 py-2 rounded-lg text-xs font-bold hover:bg-green-500/30 transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => onUpdateStatus?.(tx.id, 'failed')}
                                    className="flex-1 bg-red-500/20 text-red-500 py-2 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="px-4 py-3 text-sm font-semibold text-muted-foreground">Type</th>
                            <th className="px-4 py-3 text-sm font-semibold text-muted-foreground">Reference</th>
                            <th className="px-4 py-3 text-sm font-semibold text-muted-foreground">Amount</th>
                            <th className="px-4 py-3 text-sm font-semibold text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-sm font-semibold text-muted-foreground">Date</th>
                            {isAdmin && <th className="px-4 py-3 text-sm font-semibold text-muted-foreground text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-secondary/30 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        {getTypeIcon(tx.type)}
                                        <span className="capitalize text-sm font-medium">{tx.type}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-muted-foreground">
                                    {tx.reference}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`text-sm font-bold ${tx.type === 'deposit' || tx.type === 'profit' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(tx.status)}
                                        <span className={`text-xs font-medium capitalize ${tx.status === 'completed' ? 'text-green-500' :
                                            tx.status === 'pending' ? 'text-yellow-500' :
                                                'text-muted-foreground'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-xs text-muted-foreground">
                                    {formatDate(tx.created_at)}
                                </td>
                                {isAdmin && (
                                    <td className="px-4 py-4 whitespace-nowrap text-right">
                                        {tx.status === 'pending' && (
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => onUpdateStatus?.(tx.id, 'completed')}
                                                    className="p-1 hover:bg-green-500/20 rounded text-green-500 transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => onUpdateStatus?.(tx.id, 'failed')}
                                                    className="p-1 hover:bg-red-500/20 rounded text-red-500 transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
