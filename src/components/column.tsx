import { type Column, type ColumnId } from '@/types';
import { AddTask, Task } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

interface ColumnProps {
  columnId: ColumnId;
}

const Column = ({ columnId }: ColumnProps) => {
  const { tasks, column } = useKanbanStore(
    useShallow(({ tasks, columns }) => ({ tasks, column: columns[columnId] })),
  );

  const tasksByColumnId = column.taskIds.map((id) => tasks[id]);

  return (
    <div className="flex w-64 flex-col space-y-4">
      <h3 className="mb-2 text-sm font-bold text-baltic-400">{`${column.title} (${tasksByColumnId.length})`}</h3>
      <AddTask columnId={columnId} />
      <ul className="scroll-custom flex flex-col gap-4 overflow-y-auto">
        {tasksByColumnId.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export { Column };
