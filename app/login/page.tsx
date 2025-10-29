'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';

export default function LoginPage() {
  const { updateCredentials, updateHost, host } = useAuthContext();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hostValue, setHostValue] = useState(host);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setHostValue(host);
  }, [host]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password || !hostValue) {
      setError('请输入完整的登录信息');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const token = btoa(`${username}:${password}`);
      const sanitizedHost = hostValue.trim();

      const response = await fetch('/api/frp/tcp', {
        headers: {
          'x-frp-auth': token,
          'x-frp-host': sanitizedHost
        }
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = typeof body?.message === 'string' ? body.message : undefined;
        throw new Error(message || `登录失败，请检查凭证（HTTP ${response.status}）`);
      }

      updateHost(sanitizedHost);
      updateCredentials({ username, password });
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败，请稍后再试';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
        <h1 className="text-center text-2xl font-semibold text-slate-100">登录 FRP Web UI</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-300">
            FRPS Host
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-sky-500 focus:outline-none"
              value={hostValue}
              onChange={(e) => setHostValue(e.target.value)}
              placeholder="http://frps.example.com:7400"
              autoComplete="off"
              required
            />
          </label>
          <label className="block text-sm text-slate-300">
            用户名
            <input
              className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-sky-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="frps 用户名"
              autoComplete="username"
              required
            />
          </label>
          <label className="block text-sm text-slate-300">
            密码
            <input
              type="password"
              className="mt-1 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-sky-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="frps 密码"
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-sky-500 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? '验证中...' : '登录'}
          </button>
        </form>
      </div>
    </main>
  );
}
