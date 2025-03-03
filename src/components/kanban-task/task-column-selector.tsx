'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ColumnId, TaskDef } from '@/schema';
import { Button } from '@/components/ui/button';
import { useKanbanStore } from '@/store';
import { useEffect, useRef } from 'react';
import type { MoveTaskPayload } from '@/types';
import { cn } from '@/lib';

interface TaskColumnSelectorProps {
  task: TaskDef;
  className?: string;
}

export const TaskColumnSelector = ({ task, className }: TaskColumnSelectorProps) => {
  const getCurrentBoardColumns = useKanbanStore.use.getCurrentBoardColumns();
  const columnList = getCurrentBoardColumns();

  const columnIdx = columnList.findIndex(({ id }) => id === task.columnId);
  const moveTaskPayload = useRef<MoveTaskPayload | null>(null);

  const changeColumn = () => {
    if (moveTaskPayload.current) {
      const { moveTask } = useKanbanStore.getState();
      moveTask(moveTaskPayload.current);
      moveTaskPayload.current = null;
    }
  };

  useEffect(() => {
    return () => {
      changeColumn(); // 컬럼 변경시 다이얼로그가 닫히고 리렌더링되므로 다이얼로그를 닫을 시점에 업데이트
    };
  }, []);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select
        defaultValue={task.columnId}
        onValueChange={(targetColumnId: ColumnId) => {
          if (targetColumnId === task.columnId) {
            moveTaskPayload.current = null;
            return;
          }

          moveTaskPayload.current = {
            sourceColumnId: task.columnId,
            targetColumnId,
            sourceTaskIdx: columnList[columnIdx].taskIds.indexOf(task.id),
            targetTaskIdx: 0,
            sourceTaskId: task.id,
          };
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="컬럼을 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {columnList.map((column) => (
            <SelectItem key={column.id} value={column.id} textValue={column.title}>
              {column.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={changeColumn}>적용</Button>
    </div>
  );
};
