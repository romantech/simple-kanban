import { useKanbanStore } from '@/store';
import { cn } from '@/lib';

const BoardList = () => {
  const boards = useKanbanStore.use.boards();
  const setCurrentBoard = useKanbanStore.use.setBoard();
  const currentBoardId = useKanbanStore.use.currentBoardId();

  return (
    <div className="min-w-72 space-y-4 border-r border-baltic-900 bg-charade-950 p-6">
      <h3 className="text-sm font-bold uppercase text-baltic-400">all boards</h3>
      <ul className="space-y-2">
        {Object.values(boards).map((board) => (
          <li
            key={board.id}
            className={cn(
              'cursor-pointer font-semibold text-baltic-400 transition-all hover:text-charade-100 duration-300 line-clamp-1',
              { 'text-charade-100 font-bold': board.id === currentBoardId },
            )}
            onClick={() => setCurrentBoard(board.id)}
            role="button"
          >
            {board.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { BoardList };
