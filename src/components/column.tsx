'use client';

import { AddTaskDialog, ColumnHeader, TaskCard } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { type ColumnId } from '@/lib';
import { CirclePlus } from 'lucide-react';

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
      <AddTaskDialog columnId={columnId}>
        <button className="flex w-full cursor-pointer items-center justify-start gap-1 rounded-md border border-baltic-900 p-2 text-xs font-semibold capitalize text-baltic-200 shadow-md transition-all hover:bg-charade-950 active:scale-95">
          <CirclePlus height={14} />
          add task
        </button>
      </AddTaskDialog>
      <ul className="scroll-custom flex flex-1 flex-col gap-4 overflow-y-auto">
        {tasksByColumnId.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export { Column };
