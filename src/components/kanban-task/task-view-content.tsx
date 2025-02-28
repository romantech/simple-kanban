'use client';

import { subtaskSchema, type TaskDef } from '@/schema';
import { type KeyboardEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn, generateSubtask, TaskConfig } from '@/lib';
import { Button } from '@/components/ui/button';
import { useKanbanStore } from '@/store';
import { Subtask } from './subtask';
import { useShakeAnimation, useSubtaskCountLabel } from '@/hooks';

const TaskViewContent = ({ task }: { task: TaskDef }) => {
  const addSubtask = useKanbanStore.use.addSubtask();
  const subtaskCountLabel = useSubtaskCountLabel(task.id);

  const inputRef = useRef<HTMLInputElement>(null);
  const { triggerShake, isShaking } = useShakeAnimation();

  const onAddSubtask = () => {
    if (!inputRef.current) return;

    const result = subtaskSchema.shape.title.safeParse(inputRef.current.value);
    if (!result.success) return triggerShake();

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
      <div className="space-y-2">
        <span className="font-semibold text-baltic-400">{`하위 작업 (${subtaskCountLabel})`}</span>
        <div className="flex gap-2 pb-1.5">
          <Input
            ref={inputRef}
            placeholder={`하위 작업 추가 (${TaskConfig.subtask.title.min} ~ ${TaskConfig.subtask.title.max}자)`}
            onKeyDown={onKeyDown}
            className={cn({ 'animate-shake': isShaking })}
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
