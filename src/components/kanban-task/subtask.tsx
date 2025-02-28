import type { SubtaskId } from '@/schema';
import { useKanbanStore } from '@/store';
import { useDebouncedCallback } from 'use-debounce';
import type { ChangeEvent } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib';
import { X } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface SubtaskProps {
  subtaskId: SubtaskId;
}

export const Subtask = ({ subtaskId }: SubtaskProps) => {
  const subtask = useKanbanStore((state) => state.subtasks[subtaskId]);
  const editSubtaskTitle = useKanbanStore.use.editSubtaskTitle();
  const editSubtaskStatus = useKanbanStore.use.editSubtaskStatus();
  const deleteSubtask = useKanbanStore.use.deleteSubtask();

  const debouncedEditSubtaskTitle = useDebouncedCallback(editSubtaskTitle, 300);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedEditSubtaskTitle(subtaskId, e.target.value);
  };

  const onCheckboxChange = (checked: CheckedState) => {
    editSubtaskStatus(subtaskId, Boolean(checked));
  };

  return (
    <li className="flex items-center rounded-md bg-baltic-950 px-3 py-1 focus-within:bg-baltic-900">
      <Checkbox id={subtask.id} checked={subtask.completed} onCheckedChange={onCheckboxChange} />
      <Input
        placeholder="제목 없음"
        className={cn('border-none focus-visible:ring-0', {
          'line-through text-charade-500': subtask.completed,
        })}
        defaultValue={subtask.title}
        onChange={onInputChange}
      />
      <ConfirmDialog title="하위 작업을 삭제할까요?" onConfirm={() => deleteSubtask(subtaskId)}>
        <X className="size-4 stroke-current text-charade-500" />
      </ConfirmDialog>
    </li>
  );
};
