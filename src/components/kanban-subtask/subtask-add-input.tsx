'use client';

import { subtaskSchema, type TaskDef } from '@/schema';
import { useKanbanStore } from '@/store';
import { type KeyboardEvent, useRef } from 'react';
import { useDisclosure, useGenerateSubtasks, useShakeAnimation } from '@/hooks';
import { cn, generateSubtask, TaskConfig } from '@/lib';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BadgeAI } from '@/components/ui/badge-ai';
import { SubtaskPicker } from '@/components';

interface SubtaskInputProps {
  task: TaskDef;
  className?: string;
}

export const SubtaskAddInput = ({ task, className }: SubtaskInputProps) => {
  const sheet = useDisclosure();

  const addSubtask = useKanbanStore.use.addSubtask();
  const inputRef = useRef<HTMLInputElement>(null);

  const { generateSubtasksAsync, loading, subtaskList } = useGenerateSubtasks();

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (e.nativeEvent.isComposing) return; // 한글 입력시 이벤트 핸들러 중복 실행 방지
    onAddSubtask();
  };

  const { triggerShake, isShaking } = useShakeAnimation();

  const onAddSubtask = () => {
    if (!inputRef.current) return;

    const result = subtaskSchema.shape.title.safeParse(inputRef.current.value);
    if (!result.success) return triggerShake();

    const subtask = generateSubtask({ taskId: task.id, title: result.data, generatedByAI: false });
    addSubtask(subtask);
    inputRef.current.value = '';
  };

  const onSuggestSubtasks = async () => {
    await generateSubtasksAsync({ title: task.title, description: task.description });
    sheet.onOpenChange(true);
  };

  return (
    <div className={cn('flex gap-2 pb-1.5', className)}>
      <Input
        ref={inputRef}
        placeholder={`최대 ${TaskConfig.subtask.title.max}자`}
        onKeyDown={onKeyDown}
        className={cn({ 'animate-shake': isShaking })}
      />

      <Button onClick={onAddSubtask}>추가</Button>
      <Button
        className="relative min-w-[83px]"
        disabled={loading}
        onClick={() => void onSuggestSubtasks()}
      >
        {loading ? '생성중...' : '자동 생성'}
        <BadgeAI />
      </Button>
      {subtaskList && (
        <SubtaskPicker showOverwriteButton parentTask={task} subtaskList={subtaskList} {...sheet} />
      )}
    </div>
  );
};
