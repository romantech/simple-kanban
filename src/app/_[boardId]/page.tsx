'use client';

import { Board } from '@/components';
import { useBoardRouteSync, useHydration } from '@/hooks';

// TODO: 라우팅 추가
export default function BoardPage() {
  useBoardRouteSync();

  const isHydrated = useHydration();
  if (!isHydrated) return null;

  return <Board />;
}
