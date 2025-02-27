import type { SubtaskId } from '@/schema';
import { useKanbanStore } from '@/store';
import { useDebouncedCallback } from 'use-debounce';
import type { ChangeEvent } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib';

interface SubtaskProps {
  subtaskId: SubtaskId;
}

export const Subtask = ({ subtaskId }: SubtaskProps) => {
  const subtask = useKanbanStore((state) => state.subtasks[subtaskId]);
  const editSubtaskTitle = useKanbanStore.use.editSubtaskTitle();
  const editSubtaskStatus = useKanbanStore.use.editSubtaskStatus();

  const debouncedEditSubtaskTitle = useDebouncedCallback(editSubtaskTitle, 300);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedEditSubtaskTitle(subtaskId, e.target.value);
  };

  const onCheckboxChange = (checked: CheckedState) => {
    editSubtaskStatus(subtaskId, Boolean(checked));
  };

  return (
    <li className="flex items-center rounded-md bg-baltic-950 px-3 py-1 focus-within:bg-baltic-800">
      <Checkbox id={subtask.id} checked={subtask.completed} onCheckedChange={onCheckboxChange} />
      <Input
        placeholder="제목 없음"
        className={cn('border-none focus-visible:ring-0', {
          'line-through text-charade-500': subtask.completed,
        })}
        defaultValue={subtask.title}
        onChange={onInputChange}
      />
    </li>
  );
};
