'use client';

import Cookies from 'js-cookie';
import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const TOKEN_NAME = 'authToken';
const LAST_ACTIVITY_NAME = 'lastActivity';
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const CHECK_INTERVAL = 60 * 1000; // Check every 1 minute

// Cookie-based token management
export function getAuthToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return Cookies.get(TOKEN_NAME);
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;

  // Set cookie with secure options (expires in 7 days)
  Cookies.set(TOKEN_NAME, token, {
    expires: 7, // 7 days
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  // Track initial activity
  updateLastActivity();
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  Cookies.remove(TOKEN_NAME, { path: '/' });
  Cookies.remove(LAST_ACTIVITY_NAME, { path: '/' });
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Called by API functions when the server responds with 401 Unauthorized.
 * Clears the stored token and redirects to the sign-in page so the user
 * can re-authenticate. Safe to call from any non-React context (e.g. api.ts).
 */
export function handleUnauthorized(): void {
  if (typeof window === 'undefined') return;

  // Only act if we actually had a token (avoid redirect loops on login page)
  const hadToken = !!Cookies.get(TOKEN_NAME);
  removeAuthToken();

  if (hadToken && !window.location.pathname.startsWith('/auth')) {
    window.location.href = '/auth/sign-in?reason=session_expired';
  }
}

// Activity tracking
export function updateLastActivity(): void {
  if (typeof window === 'undefined') return;
  const now = Date.now().toString();
  Cookies.set(LAST_ACTIVITY_NAME, now, {
    expires: 7, // 7 days
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export function getLastActivity(): number | null {
  if (typeof window === 'undefined') return null;
  const lastActivity = Cookies.get(LAST_ACTIVITY_NAME);
  return lastActivity ? parseInt(lastActivity, 10) : null;
}

export function checkInactivity(): boolean {
  const lastActivity = getLastActivity();
  if (!lastActivity) return false;

  const now = Date.now();
  const timeSinceLastActivity = now - lastActivity;

  return timeSinceLastActivity >= INACTIVITY_TIMEOUT;
}

// Hook for auto-logout functionality
export function useAuthInactivity() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    removeAuthToken();

    // Only redirect if not already on auth page
    if (!pathname?.startsWith('/auth')) {
      router.push('/auth/sign-in?reason=inactive');
    }
  }, [router, pathname]);

  const checkAndLogout = useCallback(() => {
    const token = getAuthToken();

    // Only check if user is authenticated
    if (!token) return;

    // Check if session expired due to inactivity
    if (checkInactivity()) {
      logout();
    }
  }, [logout]);

  const handleActivity = useCallback(() => {
    const token = getAuthToken();
    if (token) {
      updateLastActivity();
    }
  }, []);

  useEffect(() => {
    // Don't run on auth pages
    if (pathname?.startsWith('/auth')) return;

    // Set up activity listeners
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Set up interval to check for inactivity
    const intervalId = setInterval(checkAndLogout, CHECK_INTERVAL);

    // Initial check
    checkAndLogout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(intervalId);
    };
  }, [handleActivity, checkAndLogout, pathname]);
}
