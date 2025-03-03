import type { SubtaskId } from '@/schema';
import { cn } from '@/lib';
import { Subtask } from './subtask';

interface SubtaskListProps {
  subtaskIds: SubtaskId[];
  className?: string;
}

export const SubtaskList = ({ subtaskIds, className }: SubtaskListProps) => {
  return (
    <ul className={cn('scroll-custom max-h-[274px] space-y-2 overflow-y-auto', className)}>
      {subtaskIds.map((subtaskId) => (
        <Subtask key={subtaskId} subtaskId={subtaskId} />
      ))}
    </ul>
  );
};
