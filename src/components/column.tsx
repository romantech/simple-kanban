'use client';

import { AddTaskDialog, ColumnHeader, TaskCard } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { cn, type ColumnId } from '@/lib';
import { CirclePlus } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type CSSProperties } from 'react';

interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  columnId: ColumnId;
}

const Column = ({ columnId, className, ...divProps }: ColumnProps) => {
  const deleteColumn = useKanbanStore.use.deleteColumn();
  const editColumn = useKanbanStore.use.editColumn();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: columnId,
  });

  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition };

  const { tasks, column } = useKanbanStore(
    useShallow(({ tasks, columns }) => ({ tasks, column: columns[columnId] })),
  );

  const tasksByColumnId = column.taskIds.map((id) => tasks[id]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex w-64 rounded border-2 border-baltic-900"
      />
    );
  }

  return (
    <div
      className={cn('flex w-64 shrink-0 flex-col gap-4', className)}
      style={style}
      ref={setNodeRef}
      {...divProps}
    >
      <ColumnHeader
        {...listeners}
        {...attributes}
        title={column.title}
        taskCount={tasksByColumnId.length}
        onDelete={() => deleteColumn(column)}
        onTitleChange={(newTitle) => editColumn(columnId, newTitle)}
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
