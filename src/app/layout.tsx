import { Analytics } from '@vercel/analytics/react';

import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import { type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

const pretendard = localFont({
  src: '../../public/fonts/pretendard-variable.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-pretendard',
});

const sharedMetadata = {
  title: { template: '%s | Simple Kanban', default: 'Simple Kanban' },
  description: 'Simple Kanban board built with Next.js and dnd-kit',
};

export const metadata: Metadata = {
  ...sharedMetadata,
  applicationName: 'Simple Kanban',
  icons: { icon: '/images/favicon.png' },
  creator: 'Romantech',
  metadataBase: new URL('https://kanban.romantech.net'),
  alternates: { canonical: '/' },
  keywords: ['Kanban', 'Task Management', 'dnd-kit', 'Drag and Drop', 'Next.js'],
  openGraph: {
    ...sharedMetadata,
    siteName: 'Simple Kanban',
    type: 'website',
    images: [
      { url: '/images/opengraph-image.png', width: 1200, height: 630, alt: 'Simple Kanban' },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="dark bg-baltic-950 text-charade-100 antialiased">
        <main className="h-dvh w-dvw">
          {children}
          <Analytics />
        </main>
        <Toaster />
      </body>
    </html>
  );
}
