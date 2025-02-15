'use client';

import { AddTaskDialog, ColumnHeader, Draggable, TaskCard } from '@/components';
import { useKanbanStore } from '@/store';
import { cn, type ColumnId } from '@/lib';
import { CirclePlus } from 'lucide-react';
import { SortableContext } from '@dnd-kit/sortable';

interface ColumnProps {
  columnId: ColumnId;
  className?: string;
}

const Column = ({ columnId, className }: ColumnProps) => {
  const deleteColumn = useKanbanStore.use.deleteColumn();
  const editColumn = useKanbanStore.use.editColumn();
  const column = useKanbanStore((state) => state.columns[columnId]);

  return (
    <Draggable
      className={cn('flex w-72 rounded bg-baltic-950 shrink-0 flex-col gap-4 p-2', className)}
      type="column"
      data={column}
      id={columnId}
      attach={{ listeners: false, attributes: false }}
    >
      {({ listeners, attributes }) => (
        <>
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
            <SortableContext items={column.taskIds} id={column.id}>
              {column.taskIds.map((taskId) => (
                <TaskCard key={taskId} taskId={taskId} />
              ))}
            </SortableContext>
          </ul>
        </>
      )}
    </Draggable>
  );
};

export { Column };
