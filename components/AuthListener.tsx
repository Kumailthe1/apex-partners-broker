'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setUser, logout } from '@/lib/store/authSlice';
import { apiPostJson } from '@/lib/api';

export function AuthListener() {
    const dispatch = useAppDispatch();
    const { token, user, isAuthenticated } = useAppSelector((state) => state.auth);

    const refreshUserData = useCallback(async () => {
        if (!token || !user?.id) return;

        try {
            const response = await apiPostJson<{ success: boolean; user: any }>(
                '',
                { user_id: user.id },
                { action: 'get_user_data', token }
            );

            if (response.success && response.user) {
                dispatch(setUser(response.user));
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            // If unauthorized, we might want to logout, but let's be careful
            // dispatch(logout());
        }
    }, [token, user?.id, dispatch]);

    useEffect(() => {
        // Initial refresh on mount if authenticated
        if (isAuthenticated && token && user?.id) {
            refreshUserData();
        }

        // Set up polling interval for "live balance" (e.g., every 30 seconds)
        const interval = setInterval(() => {
            if (isAuthenticated && token && user?.id) {
                refreshUserData();
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [isAuthenticated, token, user?.id, refreshUserData]);

    return null;
}
