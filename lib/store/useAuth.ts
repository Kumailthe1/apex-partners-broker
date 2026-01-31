import { useAppSelector } from './hooks';

/**
 * Custom hook to get authentication state
 * Ensures isAuthenticated is true if token exists (handles rehydration edge cases)
 */
export function useAuth() {
  const auth = useAppSelector((state) => state.auth);
  
  // If token exists but isAuthenticated is false (edge case during rehydration),
  // treat as authenticated
  const isAuthenticated = auth.isAuthenticated || !!auth.token;
  
  return {
    ...auth,
    isAuthenticated,
  };
}

