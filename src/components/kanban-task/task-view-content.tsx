'use client';

import { subtaskSchema, type TaskDef } from '@/schema';
import { type KeyboardEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { generateSubtask, TaskConfig } from '@/lib';
import { Button } from '@/components/ui/button';
import { useKanbanStore } from '@/store';
import { Subtask } from './subtask';

const TaskViewContent = ({ task }: { task: TaskDef }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const addSubtask = useKanbanStore.use.addSubtask();

  const onAddSubtask = () => {
    if (!inputRef.current) return;

    const result = subtaskSchema.shape.title.safeParse(inputRef.current.value);
    if (!result.success) return;

    const subtask = generateSubtask(task.id, result.data);
    addSubtask(subtask);
    inputRef.current.value = '';
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (e.nativeEvent.isComposing) return; // 한글 입력시 이벤트 핸들러 중복 실행 방지
    onAddSubtask();
  };

  return (
    <div className="flex flex-col gap-4 py-4 text-sm">
      <div className="space-y-1.5">
        <span className="font-semibold text-baltic-400">작업 설명</span>
        <p className="whitespace-pre-wrap">{task.description ?? '설명이 없어요'}</p>
      </div>
      <div className="space-y-1.5">
        <span className="font-semibold text-baltic-400">하위 작업</span>
        <div className="flex gap-2 pb-1.5">
          <Input
            ref={inputRef}
            placeholder={`하위 작업 추가 (최대 ${TaskConfig.subtask.title.max}자)`}
            onKeyDown={onKeyDown}
          />
          <Button type="button" onClick={onAddSubtask}>
            추가
          </Button>
        </div>
        <ul className="scroll-custom max-h-[274px] space-y-2 overflow-y-auto">
          {task.subtaskIds.map((subtaskId) => (
            <Subtask key={subtaskId} subtaskId={subtaskId} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export { TaskViewContent };
