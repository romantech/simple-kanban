import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import { type ReactNode } from 'react';
import { BoardSidebar, HeaderNav } from '@/components';

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
        <main className="h-dvh w-dvw">
          {/* 최대한 빈 배경 안보이게 하기 위해 레이아웃 관련 컴포넌트 미리 렌더링 */}
          <div className="flex size-full flex-col">
            <HeaderNav />
            {/* min-h-0 으로 flex 아이템 최소 높이 제약 해제하고, flex-1 로 실제 사용 가능한 공간 계산 */}
            <div className="flex min-h-0 flex-1">
              <BoardSidebar />
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
