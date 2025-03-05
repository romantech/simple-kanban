'use client';

import type { TaskDef } from '@/schema';
import { cn } from '@/lib';
import { Subtask } from './subtask';
import { SortableContext } from '@dnd-kit/sortable';

interface SubtaskListProps {
  task: TaskDef;
  className?: string;
}

export const SubtaskList = ({ task, className }: SubtaskListProps) => {
  return (
    <ul className={cn('scroll-custom max-h-[274px] space-y-2 overflow-y-auto', className)}>
      <SortableContext items={task.subtaskIds} id={task.id}>
        {task.subtaskIds.map((subtaskId) => (
          <Subtask key={subtaskId} subtaskId={subtaskId} />
        ))}
      </SortableContext>
    </ul>
  );
};
