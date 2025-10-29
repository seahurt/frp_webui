import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FRP Web UI',
  description: 'FRP 管理界面'
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans" className="bg-slate-950">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
