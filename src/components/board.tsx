'use client';

import { type Board, type BoardId } from '@/types';
import { Column } from '@/components';
import { useKanbanStoreBase } from '@/store';

interface BoardProps {
  boardId: BoardId;
}

const Board = ({ boardId }: BoardProps) => {
  const board = useKanbanStoreBase(({ boards }) => boards[boardId]);

  return (
    <div className="space-y-4">
      <h1 className="border-b border-line bg-haiti px-4 py-6 text-2xl font-extrabold">
        {board.title}
      </h1>
      <section className="flex gap-4 px-4">
        {board.columnIds.map((columnId) => (
          <Column key={columnId} columnId={columnId} />
        ))}
      </section>
    </div>
  );
};
export { Board };
