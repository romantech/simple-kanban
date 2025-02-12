import { type Column } from '@/types';
import { Task } from '@/components';

interface ColumnProps {
  column: Column;
  tasks: Task[];
}

const Column = ({ column, tasks }: ColumnProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-regent">{`${column.title} (${tasks.length})`}</h2>
      <ul className="flex flex-col gap-4">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export { Column };
