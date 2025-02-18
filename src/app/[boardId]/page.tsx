'use client';

import { Board } from '@/components';
import { useHydration } from '@/hooks';

export default function BoardPage() {
  // useBoardRouteSync();

  const isHydrated = useHydration();
  if (!isHydrated) return null;

  return <Board />;
}
