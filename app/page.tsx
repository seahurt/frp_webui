'use client';

import Link from 'next/link';
import { SettingsForm } from '@/components/HostConfigForm';
import { ProxyTable } from '@/components/ProxyTable';
import { useAuthContext } from '@/components/AuthProvider';
import { useProxyData } from '@/hooks/useProxyData';

export default function HomePage() {
  const {
    isAuthenticated,
    credentials,
    authToken,
    host,
    refreshInterval,
    clearCredentials
  } = useAuthContext();

  const { data, isLoading, error, lastUpdatedAt, refresh } = useProxyData({
    host,
    authToken,
    refreshInterval
  });

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-200">
        <h1 className="text-3xl font-semibold">FRP Web UI</h1>
        <p className="text-sm text-slate-400">请先登录以访问客户端列表。</p>
        <Link
          href="/login"
          className="rounded bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          前往登录
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">FRP 客户端管理</h1>
            <p className="text-sm text-slate-400">
              当前用户：<span className="font-medium text-slate-200">{credentials?.username}</span>
            </p>
            <p className="text-xs text-slate-500">当前 FRPS Host：{host}</p>
          </div>
          <button
            onClick={clearCredentials}
            className="rounded bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            退出登录
          </button>
        </div>
        <SettingsForm />
        {error && <p className="text-sm text-rose-400">{error}</p>}
      </header>

      <ProxyTable
        proxies={data}
        host={host}
        isLoading={isLoading}
        lastUpdatedAt={lastUpdatedAt}
        onRefresh={() => refresh()}
      />
    </main>
  );
}
