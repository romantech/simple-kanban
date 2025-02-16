import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import { type ReactNode } from 'react';

const pretendard = localFont({
  src: '../../public/fonts/pretendard-variable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'Simple Kanban',
  description: 'Organize your tasks effortlessly with Simple Kanban',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="kr" className={pretendard.variable}>
      <body className="dark antialiased">{children}</body>
    </html>
  );
}
