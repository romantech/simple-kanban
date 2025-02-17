import { useKanbanStore } from '@/store';
import { cn } from '@/lib';
import { SquareKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BoardAddDialog } from '@/components';

const BoardList = () => {
  const boards = useKanbanStore.use.boards();
  const setCurrentBoard = useKanbanStore.use.setCurrentBoard();
  const currentBoardId = useKanbanStore.use.currentBoardId();

  return (
    <div className="scroll-custom invisible w-0 max-w-72 space-y-4 overflow-y-auto border-r border-baltic-900 bg-charade-950 p-0 opacity-0 transition-all lg:visible lg:block lg:w-full lg:p-6 lg:opacity-100">
      <h3 className="text-sm font-bold uppercase text-baltic-400">all boards</h3>
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
    </div>
  );
};

export { BoardList };
