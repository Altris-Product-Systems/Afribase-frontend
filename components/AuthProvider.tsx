'use client';

import { useAuthInactivity } from '@/lib/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // This hook will handle auto-logout on inactivity
  useAuthInactivity();

  return <>{children}</>;
}
