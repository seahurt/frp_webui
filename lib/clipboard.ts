import { ProxyItem } from '@/lib/types';

function parseHost(rawHost: string): { protocol: string; hostname: string } {
  const fallbackProtocol = 'http';

  try {
    const hasScheme = /^https?:\/\//i.test(rawHost);
    const url = new URL(hasScheme ? rawHost : `${fallbackProtocol}://${rawHost}`);
    const protocol = url.protocol.replace(/:$/, '') || fallbackProtocol;

    return {
      protocol,
      hostname: url.hostname
    };
  } catch (error) {
    const [hostname = rawHost] = rawHost.split(':');
    return {
      protocol: fallbackProtocol,
      hostname
    };
  }
}

export function buildCommand(proxy: ProxyItem, host: string): string {
  const { protocol, hostname } = parseHost(host);
  const suffix = proxy.name.split('.').pop();
  const port = proxy.conf.remotePort;

  switch (suffix) {
    case 'ssh':
      return `ssh -p ${port} ${hostname}`;
    case 'web':
      return `${protocol}://${hostname}:${port}`;
    default:
      return `${hostname}:${port}`;
  }
}
