'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface Credentials {
  username: string;
  password: string;
}

interface AuthContextValue {
  credentials: Credentials | null;
  authToken: string | null;
  isAuthenticated: boolean;
  host: string;
  refreshInterval: number;
  updateCredentials: (value: Credentials) => void;
  clearCredentials: () => void;
  updateHost: (value: string) => void;
  updateRefreshInterval: (seconds: number) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  auth: 'frp.webui.auth',
  host: 'frp.webui.host',
  refreshInterval: 'frp.webui.interval'
} as const;

const DEFAULT_HOST = process.env.NEXT_PUBLIC_DEFAULT_FRPS_HOST ?? 'http://localhost:7400';
const DEFAULT_INTERVAL = Number.parseInt(process.env.NEXT_PUBLIC_DEFAULT_REFRESH_INTERVAL ?? '10', 10) || 10;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [host, setHost] = useState<string>(DEFAULT_HOST);
  const [refreshInterval, setRefreshInterval] = useState<number>(DEFAULT_INTERVAL);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedAuth = window.localStorage.getItem(STORAGE_KEYS.auth);
    const storedHost = window.localStorage.getItem(STORAGE_KEYS.host);
    const storedInterval = window.localStorage.getItem(STORAGE_KEYS.refreshInterval);

    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth) as Credentials;
        if (parsed.username && parsed.password) {
          setCredentials(parsed);
        }
      } catch (error) {
        console.warn('解析凭证失败', error);
      }
    }

    if (storedHost) {
      setHost(storedHost);
    }

    if (storedInterval) {
      const parsed = Number.parseInt(storedInterval, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        setRefreshInterval(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (credentials) {
      window.localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(credentials));
    }
  }, [credentials]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.host, host);
  }, [host]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.refreshInterval, refreshInterval.toString());
  }, [refreshInterval]);

  const updateCredentials = useCallback((value: Credentials) => {
    setCredentials(value);
  }, []);

  const clearCredentials = useCallback(() => {
    setCredentials(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.auth);
    }
  }, []);

  const updateHost = useCallback((value: string) => {
    setHost(value);
  }, []);

  const updateRefreshInterval = useCallback((value: number) => {
    if (Number.isNaN(value) || value <= 0) return;
    setRefreshInterval(value);
  }, []);

  const authToken = useMemo(() => {
    if (!credentials) return null;
    return btoa(`${credentials.username}:${credentials.password}`);
  }, [credentials]);

  const value = useMemo<AuthContextValue>(
    () => ({
      credentials,
      authToken,
      isAuthenticated: Boolean(credentials),
      host,
      refreshInterval,
      updateCredentials,
      clearCredentials,
      updateHost,
      updateRefreshInterval
    }),
    [authToken, credentials, host, refreshInterval, updateCredentials, clearCredentials, updateHost, updateRefreshInterval]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext 必须在 AuthProvider 中使用');
  }
  return ctx;
}
