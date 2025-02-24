import { Analytics } from '@vercel/analytics/react';

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

const sharedMetadata = {
  title: { template: '%s | Simple Kanban', default: 'Simple Kanban' },
  description: 'Simple Kanban board built with Next.js and dnd-kit',
};

export const metadata: Metadata = {
  ...sharedMetadata,
  applicationName: 'Simple Kanban',
  icons: { icon: '/favicon.png' },
  creator: 'Romantech',
  metadataBase: new URL('https://simple-kanban-iota.vercel.app'),
  keywords: ['Kanban', 'Task Management', 'dnd-kit', 'Drag and Drop'],
  openGraph: {
    ...sharedMetadata,
    siteName: 'Simple Kanban',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Simple Kanban' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="kr" className={pretendard.variable}>
      <body className="dark bg-baltic-950 text-charade-100 antialiased">
        <main className="h-dvh w-dvw">
          {children}
          <Analytics />
        </main>
      </body>
    </html>
  );
}
