import type { SubtaskId } from '@/schema';
import { useKanbanStore } from '@/store';
import { useDebouncedCallback } from 'use-debounce';
import type { ChangeEvent } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib';
import { X } from 'lucide-react';
import { AlertDialogBaseContent } from '@/components/ui/alert-dialog-base-content';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { IconButton } from '@/components/ui/icon-button';

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

  const onConfirmDelete = () => deleteSubtask(subtaskId);

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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <IconButton
            Icon={X}
            iconSize={16}
            className="size-4 stroke-current px-1 py-2.5 text-charade-500"
          />
        </AlertDialogTrigger>
        <AlertDialogBaseContent title="하위 작업을 삭제할까요?" onConfirm={onConfirmDelete} />
      </AlertDialog>
    </li>
  );
};
