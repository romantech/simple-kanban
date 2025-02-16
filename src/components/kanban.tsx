'use client';

import { KanbanHeader } from './kanban-header';
import { Board, BoardList } from '@/components/kanban-board';
import { useHydration } from '@/hooks';

const Kanban = () => {
  const isHydrated = useHydration();
  if (!isHydrated) return null;

  return (
    <div className="flex size-full flex-col">
      <KanbanHeader />
      {/* min-h-0 으로 flex 아이템 최소 높이 제약 해제하고, flex-1 로 실제 사용 가능한 공간 계산 */}
      <div className="flex min-h-0 flex-1">
        <BoardList />
        <Board />
      </div>
    </div>
  );
};

export { Kanban };
