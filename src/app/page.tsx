'use client';

import dynamic from 'next/dynamic';

const Board = dynamic(() => import('@/components/board').then(({ Board }) => Board), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <Board />
    </main>
  );
}
