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
    <div className="w-64 space-y-6">
      <h3 className="text-sm font-bold text-regent">{`${column.title} (${tasks.length})`}</h3>
      <ul className="flex flex-col gap-4">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export { Column };
