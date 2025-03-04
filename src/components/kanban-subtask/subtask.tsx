import type { SubtaskId } from '@/schema';
import { useKanbanStore } from '@/store';
import type { ChangeEvent } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { IconButton } from '@/components/ui/icon-button';
import { X } from 'lucide-react';
import { AlertDialogBaseContent } from '@/components/ui/alert-dialog-base-content';
import { useDebounceCallback } from 'usehooks-ts';

interface SubtaskProps {
  subtaskId: SubtaskId;
  className?: string;
}

export const Subtask = ({ subtaskId, className }: SubtaskProps) => {
  const subtask = useKanbanStore((state) => state.subtasks[subtaskId]);
  const editSubtaskTitle = useKanbanStore.use.editSubtaskTitle();
  const editSubtaskStatus = useKanbanStore.use.editSubtaskStatus();
  const deleteSubtask = useKanbanStore.use.deleteSubtask();

  const debouncedEditSubtaskTitle = useDebounceCallback(editSubtaskTitle, 300);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedEditSubtaskTitle(subtaskId, e.target.value);
  };

  const onCheckboxChange = (checked: CheckedState) => {
    editSubtaskStatus(subtaskId, Boolean(checked));
  };

  const onConfirmDelete = () => deleteSubtask(subtaskId);

  return (
    <li
      className={cn(
        'flex items-center rounded-md border border-baltic-950 bg-baltic-950 px-3 py-1 focus-within:border-charade-600',
        className,
      )}
    >
      <Checkbox
        className="data-[state=checked]:border-charade-500 data-[state=checked]:bg-charade-500 data-[state=checked]:text-baltic-950"
        id={subtask.id}
        checked={subtask.completed}
        onCheckedChange={onCheckboxChange}
      />
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
            tooltipContent="삭제"
          />
        </AlertDialogTrigger>
        <AlertDialogBaseContent title="하위 작업을 삭제할까요?" onConfirm={onConfirmDelete} />
      </AlertDialog>
    </li>
  );
};
