'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuthContext } from '@/components/AuthProvider';

export function SettingsForm() {
  const { refreshInterval, updateRefreshInterval } = useAuthContext();
  const [intervalValue, setIntervalValue] = useState<number>(refreshInterval);

  useEffect(() => {
    setIntervalValue(refreshInterval);
  }, [refreshInterval]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = Number.isFinite(intervalValue) ? Math.max(5, intervalValue) : 10;
    updateRefreshInterval(normalized);
  };

  return (
    <form className="flex flex-wrap items-end gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col text-sm text-slate-300">
        刷新间隔 (秒)
        <input
          type="number"
          min={5}
          className="mt-1 w-32 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-sky-500 focus:outline-none"
          value={intervalValue}
          onChange={(e) => setIntervalValue(Number.parseInt(e.target.value, 10))}
          required
        />
      </label>
      <button
        type="submit"
        className="rounded bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
      >
        保存刷新频率
      </button>
    </form>
  );
}
