'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/useAuth';
import { apiPostJson, apiGetJson } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Users, DollarSign, Trash2, Edit, Loader2, Search, History, CheckCircle2, XCircle } from 'lucide-react';
import { TransactionTable, Transaction } from '@/components/TransactionTable';

interface User {
    id: string;
    full_name: string;
    email: string;
    balance: string;
    role: string;
    status: string;
    created_at: string;
}

const AdminPage = () => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newBalance, setNewBalance] = useState('');
    const [updating, setUpdating] = useState(false);
    const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('users');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTx, setLoadingTx] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Check if user is admin
        if (user?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        fetchUsers();
        fetchTransactions();
    }, [isAuthenticated, user, router]);

    const fetchTransactions = async () => {
        try {
            setLoadingTx(true);
            const res = await apiPostJson<any>('', {}, { action: 'admin_get_transactions' });
            if (res.success && res.transactions) {
                setTransactions(res.transactions);
            }
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        } finally {
            setLoadingTx(false);
        }
    };

    const handleUpdateTransactionStatus = async (txId: number, status: string) => {
        try {
            const res = await apiPostJson<any>('', {
                transaction_id: txId,
                status: status
            }, { action: 'admin_update_transaction_status' });

            if (res.success) {
                fetchTransactions();
            }
        } catch (err) {
            console.error('Failed to update transaction status:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await apiPostJson<any>('', {}, { action: 'admin_get_users' });
            if (res.success && res.users) {
                setUsers(res.users);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBalance = async () => {
        if (!editingUser || !newBalance) return;

        try {
            setUpdating(true);
            const res = await apiPostJson<any>('', {
                user_id: editingUser.id,
                balance: parseFloat(newBalance)
            }, { action: 'admin_update_balance' });

            if (res.success) {
                await fetchUsers();
                setEditingUser(null);
                setNewBalance('');
            }
        } catch (err) {
            console.error('Failed to update balance:', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await apiPostJson<any>('', {
                user_id: userId
            }, { action: 'admin_delete_user' });

            if (res.success) {
                await fetchUsers();
            }
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                    <p className="text-muted-foreground">Manage users and balances</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="glass-effect rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                                <p className="text-3xl font-bold">{users.length}</p>
                            </div>
                            <Users className="h-10 w-10 text-primary/50" />
                        </div>
                    </div>
                    <div className="glass-effect rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                                <p className="text-3xl font-bold">
                                    ${users.reduce((sum, u) => sum + parseFloat(u.balance || '0'), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <DollarSign className="h-10 w-10 text-primary/50" />
                        </div>
                    </div>
                    <div className="glass-effect rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                                <p className="text-3xl font-bold">
                                    {users.filter(u => u.status === 'active').length}
                                </p>
                            </div>
                            <Users className="h-10 w-10 text-green-500/50" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'users'
                            ? 'bg-gradient-to-r from-primary to-accent text-black shadow-lg scale-105'
                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'transactions'
                            ? 'bg-gradient-to-r from-primary to-accent text-black shadow-lg scale-105'
                            : 'bg-secondary text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Transactions
                    </button>
                </div>

                {activeTab === 'users' ? (
                    <>
                        {/* Search */}
                        <div className="glass-effect rounded-xl p-4 mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="glass-effect rounded-xl overflow-hidden">
                            {loading ? (
                                <div className="flex items-center justify-center p-12">
                                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-secondary/50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Balance</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold">Joined</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredUsers.map((u) => (
                                                <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                                                    <td className="px-4 py-3 text-sm">{u.full_name}</td>
                                                    <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                                                    <td className="px-4 py-3 text-sm font-mono font-semibold text-primary">
                                                        ${parseFloat(u.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                                            }`}>
                                                            {u.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                                        {new Date(u.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingUser(u);
                                                                    setNewBalance(u.balance);
                                                                }}
                                                                className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                                                                title="Edit Balance"
                                                            >
                                                                <Edit className="h-4 w-4 text-primary" />
                                                            </button>
                                                            {u.role !== 'admin' && (
                                                                <button
                                                                    onClick={() => handleDeleteUser(u.id)}
                                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="glass-effect rounded-xl p-6 border border-border">
                        <div className="flex items-center space-x-2 mb-6">
                            <History className="h-6 w-6 text-primary" />
                            <h2 className="text-xl font-bold">All Transactions</h2>
                        </div>
                        {loadingTx ? (
                            <div className="flex items-center justify-center p-12">
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            </div>
                        ) : (
                            <TransactionTable
                                transactions={transactions}
                                isAdmin
                                onUpdateStatus={handleUpdateTransactionStatus}
                            />
                        )}
                    </div>
                )}


                {/* Edit Balance Modal */}
                {editingUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="glass-effect rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold mb-4">Update Balance</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Editing balance for: <strong>{editingUser.full_name}</strong>
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">New Balance (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <input
                                        type="number"
                                        value={newBalance}
                                        onChange={(e) => setNewBalance(e.target.value)}
                                        className="w-full bg-secondary border border-border rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleUpdateBalance}
                                    disabled={updating}
                                    className="flex-1 bg-gradient-to-r from-primary to-accent text-black rounded-lg py-3 font-semibold hover:scale-105 transition-transform duration-300 disabled:opacity-50"
                                >
                                    {updating ? 'Updating...' : 'Update Balance'}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingUser(null);
                                        setNewBalance('');
                                    }}
                                    className="flex-1 border-2 border-border rounded-lg py-3 font-semibold hover:bg-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminPage;
