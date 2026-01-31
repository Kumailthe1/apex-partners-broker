import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id?: number;
    email?: string;
    username?: string;
    full_name?: string;
    balance?: number;
    role?: 'user' | 'admin';
  } | null;
  _persist?: {
    version: number;
    rehydrated: boolean;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{
      token: string;
      user?: {
        id?: number;
        email?: string;
        username?: string;
        full_name?: string;
        balance?: number;
        role?: 'user' | 'admin';
      };
      rememberMe?: boolean
    }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      const user = action.payload.user;
      if (user && 'balance' in user) {
        user.balance = Number(user.balance);
      }
      state.user = user || null;
      // Redux Persist will automatically save to localStorage
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      // Redux Persist will automatically clear from localStorage
    },
    setUser: (state, action: PayloadAction<{
      id?: number;
      email?: string;
      username?: string;
      full_name?: string;
      balance?: number;
      role?: 'user' | 'admin';
    }>) => {
      const payload = { ...action.payload };
      if ('balance' in payload) {
        payload.balance = Number(payload.balance);
      }
      if (state.user) {
        state.user = { ...state.user, ...payload };
      } else {
        state.user = payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Handle rehydration from Redux Persist
    builder.addCase(REHYDRATE, (state, action: any) => {
      // Redux Persist passes the entire persisted state
      if (action.payload && action.payload.auth) {
        const rehydratedAuth = action.payload.auth;
        // If token exists after rehydration, ensure isAuthenticated is true
        return {
          ...rehydratedAuth,
          isAuthenticated: !!rehydratedAuth.token, // Set isAuthenticated based on token presence
        };
      }
      // If no payload, return current state
      return state;
    });
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;

