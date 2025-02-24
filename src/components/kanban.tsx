'use client';

import { HeaderNav } from '@/components/kanban-header';
import { Board, BoardSidebar } from '@/components/kanban-board';
import { useInitBoard } from '@/hooks';
import { type BoardId } from '@/schema';

const Kanban = ({ boardId }: { boardId: BoardId }) => {
  const isHydrated = useInitBoard(boardId);

  if (!isHydrated) return null;

  return (
    <div className="flex size-full flex-col">
      <HeaderNav />
      {/* min-h-0 으로 flex 아이템 최소 높이 제약 해제하고, flex-1 로 실제 사용 가능한 공간 계산 */}
      <div className="flex min-h-0 flex-1">
        <BoardSidebar />
        <Board />
      </div>
    </div>
  );
};

export { Kanban };
