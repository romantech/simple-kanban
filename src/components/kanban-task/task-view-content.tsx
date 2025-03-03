'use client';

import { type ColumnId, type TaskDef } from '@/schema';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useKanbanStore } from '@/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type MoveTaskPayload } from '@/types';
import { SubtaskInput, SubtaskList } from '@/components';
import { useSubtaskCount } from '@/hooks';

const TaskViewContent = ({ task }: { task: TaskDef }) => {
  const { label } = useSubtaskCount(task.id);

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
    <div className="flex flex-col gap-4 py-4 text-sm">
      <div className="space-y-1.5">
        <span className="font-semibold text-baltic-400">작업 설명</span>
        <p className="whitespace-pre-wrap">{task.description ?? '설명이 없어요'}</p>
      </div>
      <div className="space-y-1.5">
        <span className="font-semibold text-baltic-400">작업 분류 (컬럼)</span>
        <div className="flex items-center gap-2">
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
      </div>
      <div className="space-y-2">
        <span className="font-semibold text-baltic-400">{`하위 작업 (${label})`}</span>
        <SubtaskInput taskId={task.id} />
        <SubtaskList subtaskIds={task.subtaskIds} />
      </div>
    </div>
  );
};

export { TaskViewContent };
