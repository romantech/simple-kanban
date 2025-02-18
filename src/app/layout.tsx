import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import { type ReactNode } from 'react';

const pretendard = localFont({
  src: '../../public/fonts/pretendard-variable.woff2',
  display: 'swap',
  weight: '100 900',
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
      <body className="dark bg-baltic-950 text-charade-100 antialiased">
        <main className="h-dvh w-dvw">{children}</main>
      </body>
    </html>
  );
}
