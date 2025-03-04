'use client';

import { ColumnHeader, Draggable, Task, TaskAddDialog } from '@/components';
import { useKanbanStore } from '@/store';
import { cn } from '@/lib';
import { CirclePlus } from 'lucide-react';
import { SortableContext } from '@dnd-kit/sortable';
import { type ColumnId } from '@/schema';

interface ColumnProps {
  columnId: ColumnId;
  className?: string;
}

const Column = ({ columnId, className }: ColumnProps) => {
  const column = useKanbanStore((state) => state.columns[columnId]);

  // 보드 삭제 시 컬럼도 삭제됨. 이때 삭제한 컬럼 ID를 참조하는 컴포넌트가 일시적으로 남아있을 수 있으므로 조건 추가
  if (!column) return null;

  return (
    <Draggable
      type="column"
      data={column}
      id={columnId}
      rootDndConfig={{ listeners: false, attributes: false }}
      className={cn(
        'flex w-full max-h-full min-h-64 max-w-72 rounded bg-baltic-950 shrink-0 flex-col gap-4 p-2',
        className,
      )}
    >
      {({ listeners, attributes }) => (
        <>
          <ColumnHeader {...listeners} {...attributes} column={column} />
          <TaskAddDialog columnId={columnId}>
            <button className="flex w-full cursor-pointer items-center justify-start gap-1 rounded-md border border-baltic-900 p-2 text-xs font-semibold capitalize text-baltic-200 shadow-md transition-all hover:bg-charade-950 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring active:scale-95">
              <CirclePlus height={14} />
              작업 추가
            </button>
          </TaskAddDialog>
          <ul className="scroll-custom flex flex-1 flex-col gap-4 overflow-y-auto">
            <SortableContext items={column.taskIds} id={column.id}>
              {column.taskIds.map((taskId) => (
                <Task key={taskId} taskId={taskId} />
              ))}
            </SortableContext>
          </ul>
        </>
      )}
    </Draggable>
  );
};

export { Column };
