import { type Board, type Columns, type Tasks } from '@/types';
import { Column } from '@/components';

interface BoardProps {
  board: Board;
  columns: Columns;
  tasks: Tasks;
}

const Board = ({ board, tasks, columns }: BoardProps) => {
  return (
    <div className="space-y-4">
      <h1 className="border-b border-line bg-haiti px-4 py-6 text-2xl font-extrabold">
        {board.title}
      </h1>
      <section className="flex gap-4 px-4">
        {board.columnIds.map((columnId) => {
          const column = columns[columnId];
          const tasksForColumn = column.taskIds.map((id) => tasks[id]);
          return <Column key={columnId} tasks={tasksForColumn} column={column} />;
        })}
      </section>
    </div>
  );
};
export { Board };
