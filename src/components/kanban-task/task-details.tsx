'use client';

import { type TaskDef } from '@/schema';
import { SubtaskInput, SubtaskList, TaskColumnSelector } from '@/components';
import { useSubtaskCount } from '@/hooks';
import { cn } from '@/lib';

const TaskDetails = ({ task }: { task: TaskDef }) => {
  const { label } = useSubtaskCount(task.id);

  return (
    <div className="flex flex-col gap-5 py-4 text-sm">
      <div className="space-y-1.5">
        <TaskDetailsLabel>작업 설명</TaskDetailsLabel>
        <p className="whitespace-pre-wrap">{task.description ?? '설명이 없어요'}</p>
      </div>
      <div className="space-y-1.5">
        <TaskDetailsLabel>작업 분류 (컬럼)</TaskDetailsLabel>
        <TaskColumnSelector task={task} />
      </div>
      <div className="space-y-2">
        <TaskDetailsLabel>{`하위 작업 (${label})`}</TaskDetailsLabel>
        <SubtaskInput task={task} />
        <SubtaskList task={task} />
      </div>
    </div>
  );
};

interface TaskDetailsLabelProps {
  children: React.ReactNode;
  className?: string;
}

const TaskDetailsLabel = ({ children, className }: TaskDetailsLabelProps) => {
  return <span className={cn('font-semibold text-baltic-400', className)}>{children}</span>;
};

export { TaskDetails };
