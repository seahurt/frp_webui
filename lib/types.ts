export interface ProxyConfig {
  name: string;
  type: string;
  localIP: string;
  remotePort: number;
  plugin: string | null;
}

export interface ProxyItem {
  name: string;
  conf: ProxyConfig;
  clientVersion: string;
  todayTrafficIn: number;
  todayTrafficOut: number;
  curConns: number;
  lastStartTime: string;
  lastCloseTime: string;
  status: 'online' | 'offline';
}

export interface ProxyResponse {
  proxies: ProxyItem[];
}
