import { type Board, type Columns, type Tasks } from '@/types';
import { Column } from '@/components';

interface BoardProps {
  board: Board;
  columns: Columns;
  tasks: Tasks;
}

const Board = ({ board, tasks, columns }: BoardProps) => {
  return (
    <div>
      <h1>{board.title}</h1>
      <div>
        {board.columnIds.map((columnId) => {
          const column = columns[columnId];
          const tasksForColumn = column.taskIds.map((id) => tasks[id]);
          return <Column key={columnId} tasks={tasksForColumn} column={column} />;
        })}
      </div>
    </div>
  );
};
export { Board };
