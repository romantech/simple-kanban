'use client';

import { Kanban } from '@/components';
import { useHydration } from '@/hooks';
import { type BoardId } from '@/lib';
import { use, useEffect } from 'react';
import { useKanbanStore } from '@/store';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ boardId: BoardId }>;
}

export default function BoardPage({ params }: Props) {
  const { boardId } = use(params);

  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;

    const { setCurrentBoard, boards } = useKanbanStore.getState();
    if (boards[boardId]) setCurrentBoard(boardId);
    else notFound();
  }, [boardId, isHydrated]);

  if (!isHydrated) return null;

  return <Kanban />;
}
