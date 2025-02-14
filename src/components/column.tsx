'use client';

import { AddTaskDialog, ColumnHeader, TaskCard } from '@/components';
import { useKanbanStore } from '@/store';
import { cn, type ColumnId } from '@/lib';
import { CirclePlus } from 'lucide-react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type CSSProperties } from 'react';
import { DndPlaceholder } from '@/components/ui/dnd-placeholder';

interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  columnId: ColumnId;
}

const Column = ({ columnId, className, ...divProps }: ColumnProps) => {
  const deleteColumn = useKanbanStore.use.deleteColumn();
  const editColumn = useKanbanStore.use.editColumn();
  const column = useKanbanStore((state) => state.columns[columnId]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: columnId,
    data: { type: 'column' },
  });

  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging) return <DndPlaceholder style={style} ref={setNodeRef} />;

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
        taskCount={column.taskIds.length}
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
        <SortableContext items={column.taskIds}>
          {column.taskIds.map((taskId) => (
            <TaskCard key={taskId} taskId={taskId} />
          ))}
        </SortableContext>
      </ul>
    </div>
  );
};

export { Column };
