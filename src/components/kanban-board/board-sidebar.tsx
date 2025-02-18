'use client';

import { useKanbanStore } from '@/store';
import { cn } from '@/lib';
import { SquareKanban } from 'lucide-react';
import { BoardAddDialog } from '@/components';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/ui/sidebar';

const BoardSidebar = () => {
  const boards = useKanbanStore.use.boards();
  const setCurrentBoard = useKanbanStore.use.setCurrentBoard();
  const currentBoardId = useKanbanStore.use.currentBoardId();

  return (
    <Sidebar>
      <ul className="flex flex-col divide-y divide-baltic-900">
        {Object.values(boards).map((board) => (
          <li
            key={board.id}
            className={cn(
              'cursor-pointer font-semibold text-baltic-400 transition-all hover:text-charade-100 duration-300 truncate py-2',
              { 'text-charade-100 font-bold': board.id === currentBoardId },
            )}
            onClick={() => setCurrentBoard(board.id)}
            role="button"
          >
            <SquareKanban className="inline size-[26px] pr-2" />
            {board.title}
          </li>
        ))}
      </ul>
      <div className="sticky bottom-0">
        <BoardAddDialog>
          <Button className="w-full font-bold capitalize">add board</Button>
        </BoardAddDialog>
      </div>
    </Sidebar>
  );
};

export { BoardSidebar };
