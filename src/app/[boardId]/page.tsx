'use client';

import { Kanban } from '@/components';
import { useBoardRouteSync, useHydration } from '@/hooks';

export default function BoardPage() {
  useBoardRouteSync();

  const isHydrated = useHydration();
  if (!isHydrated) return null;

  return <Kanban />;
}
