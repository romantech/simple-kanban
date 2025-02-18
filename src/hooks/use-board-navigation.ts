'use client';

import { useRouter } from 'next/navigation';
import { useKanbanStore } from '@/store';
import { type BoardId } from '@/lib';

export const useBoardNavigation = () => {
  const router = useRouter();
  const setCurrentBoard = useKanbanStore.use.setCurrentBoard();

  return (id: BoardId) => {
    setCurrentBoard(id);
    router.push(id);
  };
};
