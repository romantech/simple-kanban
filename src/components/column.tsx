import { type Column } from '@/types';
import { Task } from '@/components';

interface ColumnProps {
  column: Column;
  tasks: Task[];
}

const Column = ({ column, tasks }: ColumnProps) => {
  return (
    <div>
      <h2>{column.title}</h2>
      <div>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export { Column };
