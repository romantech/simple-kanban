import { type Column, type ColumnId } from '@/types';
import { Task } from '@/components';
import { useKanbanStore } from '@/store';

interface ColumnProps {
  columnId: ColumnId;
}

const Column = ({ columnId }: ColumnProps) => {
  const getColumnWithTasks = useKanbanStore.use.getColumnWithTasks();
  const { tasks, column } = getColumnWithTasks(columnId);

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
