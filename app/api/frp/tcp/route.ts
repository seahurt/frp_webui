import { NextRequest, NextResponse } from 'next/server';
import { fetchTcpProxies } from '@/lib/frpClient';

const SERVER_HOST = process.env.FRPS_HOST ?? process.env.NEXT_PUBLIC_DEFAULT_FRPS_HOST;

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('x-frp-auth');
    const hostFromHeader = request.headers.get('x-frp-host');
    const host = hostFromHeader || SERVER_HOST;

    if (!authToken) {
      return NextResponse.json({ message: '缺少认证信息' }, { status: 401 });
    }

    if (!host) {
      return NextResponse.json({ message: '缺少 FRPS Host 配置' }, { status: 400 });
    }

    const data = await fetchTcpProxies(host, authToken);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : '服务端未知错误';
    return NextResponse.json({ message }, { status: 500 });
  }
}
