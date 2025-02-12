import { useKanbanStore } from '@/store';
import { cn } from '@/lib';

const BoardList = () => {
  const boards = useKanbanStore.use.boards();
  const setCurrentBoard = useKanbanStore.use.setBoard();
  const currentBoardId = useKanbanStore.use.currentBoardId();

  return (
    <div className="min-w-72 space-y-4 border-r border-line bg-haiti p-6">
      <h3 className="text-sm font-bold uppercase text-regent">all boards</h3>
      <ul className="space-y-2">
        {Object.values(boards).map((board) => (
          <li
            key={board.id}
            className={cn(
              'cursor-pointer font-semibold text-regent transition-all hover:text-white duration-300 line-clamp-1',
              { 'text-white font-bold': board.id === currentBoardId },
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
