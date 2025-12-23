'use client';

import { ReactNode, useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '../lib/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseValue = useMemo(() => initializeFirebase(), []);

  return <FirebaseProvider value={firebaseValue}>{children}</FirebaseProvider>;
}
