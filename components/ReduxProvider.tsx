'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store/store';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import { AuthListener } from './AuthListener';

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin-ease-out" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        }
        persistor={persistor}
      >
        <AuthListener />
        {children}
      </PersistGate>
    </Provider>
  );
}

