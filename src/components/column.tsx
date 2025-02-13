'use client';

import { AddTaskDialog, ColumnHeader, Task } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { type ColumnId } from '@/lib';

interface ColumnProps {
  columnId: ColumnId;
}

const Column = ({ columnId }: ColumnProps) => {
  const deleteColumn = useKanbanStore.use.deleteColumn();
  const setColumnTitle = useKanbanStore.use.setColumnTitle();

  const { tasks, column } = useKanbanStore(
    useShallow(({ tasks, columns }) => ({ tasks, column: columns[columnId] })),
  );

  const tasksByColumnId = column.taskIds.map((id) => tasks[id]);

  return (
    <div className="flex w-64 shrink-0 flex-col gap-4">
      <ColumnHeader
        title={column.title}
        taskCount={tasksByColumnId.length}
        onDelete={() => deleteColumn(columnId)}
        onTitleChange={(newTitle) => setColumnTitle(columnId, newTitle)}
      />
      <AddTaskDialog columnId={columnId} />
      <ul className="scroll-custom flex flex-1 flex-col gap-4 overflow-y-auto">
        {tasksByColumnId.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export { Column };
