'use client';

import { useEffect } from 'react';
import { useKanbanStore } from '@/store';
import { useHydration } from '@/hooks/kanban/use-hydration';
import { useRouter } from 'next/navigation';
import { type BoardId } from '@/schema';

export const useInitBoard = (boardId: BoardId) => {
  const router = useRouter();
  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;

    // useStore.getState()로 값 가져오면 반응성 없음(상태 변경에 따른 리렌더링 발생 안함)
    const { setCurrentBoard, boards, currentBoardId } = useKanbanStore.getState();

    if (boards[boardId]) setCurrentBoard(boardId);
    else router.replace(`/${currentBoardId}?title=${boards[currentBoardId].title}`);
  }, [boardId, isHydrated, router]);

  return isHydrated;
};
