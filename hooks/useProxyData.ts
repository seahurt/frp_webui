'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProxyItem } from '@/lib/types';

interface UseProxyDataOptions {
  host: string;
  authToken: string | null;
  refreshInterval: number;
}

interface ProxyState {
  data: ProxyItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdatedAt: Date | null;
  refresh: () => Promise<void>;
}

const MIN_INTERVAL_MS = 5_000;

export function useProxyData({ host, authToken, refreshInterval }: UseProxyDataOptions): ProxyState {
  const [data, setData] = useState<ProxyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const effectiveInterval = useMemo(() => {
    const intervalMs = Math.max(refreshInterval * 1_000, MIN_INTERVAL_MS);
    return Number.isFinite(intervalMs) ? intervalMs : MIN_INTERVAL_MS;
  }, [refreshInterval]);

  const fetchData = useCallback(async () => {
    if (!authToken) {
      setError('尚未登录或凭证无效');
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/frp/tcp', {
        headers: {
          'x-frp-auth': authToken,
          'x-frp-host': host
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `请求失败: ${response.status}`);
      }

      const json = await response.json();
      setData(json.proxies ?? []);
      setLastUpdatedAt(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, host]);

  useEffect(() => {
    void fetchData();

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [fetchData]);

  useEffect(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }

    if (!authToken) {
      return;
    }

    intervalId.current = setInterval(() => {
      void fetchData();
    }, effectiveInterval);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [authToken, effectiveInterval, fetchData]);

  return {
    data,
    isLoading,
    error,
    lastUpdatedAt,
    refresh: fetchData
  };
}
