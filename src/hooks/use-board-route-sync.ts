import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useKanbanStore } from '@/store';
import { type BoardId } from '@/lib';

export const useBoardRouteSync = () => {
  const router = useRouter();
  const { boardId } = useParams<{ boardId: BoardId }>();

  // 주소창에 /{boardId} 바로 입력했을 때
  useEffect(() => {
    // useStore.getState()로 값 가져오면 반응성 없음(상태 변경에 따른 리렌더링 발생 안함)
    const { boards, setCurrentBoard } = useKanbanStore.getState();

    // 없는 boardId 를 주소창에 입력해서 접속했을 때
    if (!boards[boardId]) router.replace('/');
    // 존재하는 boardId 를 주소창에 입력해서 접속했을 때
    else setCurrentBoard(boardId);
  }, [boardId, router]);

  // 보드 변경/추가/삭제했을 때
  useEffect(() => {
    return useKanbanStore.subscribe(
      (state) => state.currentBoardId,
      (newBoardId) => {
        if (newBoardId !== boardId) router.push(newBoardId);
      },
      // { fireImmediately: true },
    );
  }, [boardId, router]);
};
