'use client';

import { useState } from 'react';
import { buildCommand } from '@/lib/clipboard';
import { ProxyItem } from '@/lib/types';

interface Props {
  proxies: ProxyItem[];
  host: string;
  isLoading: boolean;
  lastUpdatedAt: Date | null;
  onRefresh: () => void;
}

export function ProxyTable({ proxies, host, isLoading, lastUpdatedAt, onRefresh }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (proxy: ProxyItem) => {
    const command = buildCommand(proxy, host);
    try {
      
      if (!navigator.clipboard || !window.isSecureContext) {
        alert('当前环境不支持剪贴板功能，请手动复制以下内容：\n' + command);
        return;
      }
      await navigator.clipboard.writeText(command);
      setCopied(proxy.name);
      setTimeout(() => setCopied(null), 2_000);
    } catch (error) {
      console.error('复制失败', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      alert(`复制失败，请手动复制以下内容：\n${command}\n\n错误详情：${errorMessage}`);
    }
  };

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">客户端列表</h2>
          <p className="text-xs text-slate-400">
            {lastUpdatedAt ? `最后刷新：${lastUpdatedAt.toLocaleTimeString()}` : '尚未刷新'}
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-400"
          disabled={isLoading}
        >
          {isLoading ? '刷新中...' : '手动刷新'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-950/60">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-300">名称</th>
              <th className="px-4 py-3 font-medium text-slate-300">端口</th>
              <th className="px-4 py-3 font-medium text-slate-300">连接数</th>
              <th className="px-4 py-3 font-medium text-slate-300">客户端版本</th>
              <th className="px-4 py-3 font-medium text-slate-300">状态</th>
              <th className="px-4 py-3 font-medium text-slate-300 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {proxies.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  暂无数据，请确认 frps 配置或稍后重试。
                </td>
              </tr>
            ) : (
              proxies.map((proxy) => (
                <tr key={proxy.name} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-mono text-slate-100">{proxy.name}</td>
                  <td className="px-4 py-3 text-slate-200">{proxy.conf.remotePort}</td>
                  <td className="px-4 py-3 text-slate-200">{proxy.curConns}</td>
                  <td className="px-4 py-3 text-slate-200">{proxy.clientVersion}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        proxy.status === 'online'
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'bg-rose-400/10 text-rose-300'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {proxy.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleCopy(proxy)}
                      className="rounded bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:bg-slate-700"
                    >
                      {copied === proxy.name ? '已复制' : '复制命令'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
