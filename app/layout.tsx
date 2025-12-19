import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FRP Web UI',
  description: 'FRP 管理界面'
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const defaultHost = process.env.FRPS_HOST ?? process.env.NEXT_PUBLIC_DEFAULT_FRPS_HOST;
  const defaultInterval = Number.parseInt(process.env.NEXT_PUBLIC_DEFAULT_REFRESH_INTERVAL ?? '10', 10) || 10;

  return (
    <html lang="zh-Hans" className="bg-slate-950">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100`}>
        <AuthProvider defaultHost={defaultHost} defaultInterval={defaultInterval}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
