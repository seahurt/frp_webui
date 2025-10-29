import { ProxyResponse } from '@/lib/types';

function sanitizeHost(host: string): string {
  const trimmed = host.trim();
  if (!trimmed) {
    throw new Error('FRPS 主机地址为空');
  }
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

export async function fetchTcpProxies(host: string, base64Credential: string): Promise<ProxyResponse> {
  const safeHost = sanitizeHost(host);
  const endpoint = `${safeHost}/api/proxy/tcp`;
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Basic ${base64Credential}`
    },
    cache: 'no-store'
  });
  console.log(base64Credential);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`获取 TCP 代理失败 (${response.status}): ${text || 'unknown error'}`);
  }

  return response.json();
}
