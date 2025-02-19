'use client';

import { Kanban } from '@/components';
import { use } from 'react';
import { useInitBoard } from '@/hooks/use-init-board';
import { type BoardId } from '@/schema';

interface Props {
  params: Promise<{ boardId: BoardId }>;
}

export default function BoardPage({ params }: Props) {
  const { boardId } = use(params);

  const isHydrated = useInitBoard(boardId);

  if (!isHydrated) return null;

  return <Kanban />;
}
