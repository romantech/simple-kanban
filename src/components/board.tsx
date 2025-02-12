import { type Board } from '@/types';
import { Column } from '@/components';
import { useKanbanStoreBase } from '@/store';

const Board = () => {
  const board = useKanbanStoreBase((state) => state.getBoard());

  return (
    <div className="flex gap-4 p-6">
      {board.columnIds.map((columnId) => (
        <Column key={columnId} columnId={columnId} />
      ))}
    </div>
  );
};
export { Board };
