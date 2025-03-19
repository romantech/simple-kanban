import type { SubtaskId } from '@/schema';
import { useKanbanStore } from '@/store';
import { type ChangeEvent, Fragment } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { cn } from '@/lib';
import { Draggable } from '@/components';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { IconButton } from '@/components/ui/icon-button';
import { GripVertical, X } from 'lucide-react';
import { AlertDialogBaseContent } from '@/components/ui/alert-dialog-base-content';
import { useDebounceFn } from 'ahooks';
import { toast } from 'sonner';

interface SubtaskProps {
  subtaskId: SubtaskId;
  className?: string;
}

export const Subtask = ({ subtaskId, className }: SubtaskProps) => {
  const subtask = useKanbanStore((state) => state.subtasks[subtaskId]);
  const editSubtaskTitle = useKanbanStore.use.editSubtaskTitle();
  const editSubtaskStatus = useKanbanStore.use.editSubtaskStatus();
  const deleteSubtask = useKanbanStore.use.deleteSubtask();

  const debouncedEditSubtaskTitle = useDebounceFn(editSubtaskTitle, { wait: 300 });

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    (debouncedEditSubtaskTitle.run as typeof editSubtaskTitle)(subtaskId, e.target.value);
  };

  const onCheckboxChange = (checked: CheckedState) => {
    editSubtaskStatus(subtaskId, Boolean(checked));
  };

  const onConfirmDelete = () => {
    deleteSubtask(subtaskId);
    toast.success('하위 작업이 삭제되었습니다.');
  };

  return (
    <Draggable
      id={subtask.id}
      data={subtask}
      type="subtask"
      rootDndConfig={{ listeners: false, attributes: false }}
      as="li"
      className={cn(
        'flex gap-1.5 items-center rounded-md border border-baltic-950 bg-baltic-950 px-3 py-1 focus-within:border-charade-600',
        className,
      )}
    >
      {({ listeners, attributes }) => (
        <Fragment>
          <Checkbox
            className="data-[state=checked]:border-charade-500 data-[state=checked]:bg-charade-500 data-[state=checked]:text-baltic-950"
            id={subtask.id}
            checked={subtask.completed}
            onCheckedChange={onCheckboxChange}
            aria-checked={subtask.completed}
            aria-label={`${subtask.title} 완료 여부`}
          />
          <Input
            placeholder="제목 없음"
            className={cn('border-none focus-visible:ring-0', {
              'line-through text-charade-500': subtask.completed,
            })}
            defaultValue={subtask.title}
            onChange={onInputChange}
          />
          <IconButton
            Icon={GripVertical}
            className="text-charade-500"
            aria-label="하위 작업 순서 변경"
            {...listeners}
            {...attributes}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <IconButton
                Icon={X}
                iconSize={16}
                aria-label="하위 작업 삭제"
                className="size-4 stroke-current px-1 py-2.5 text-charade-500"
              />
            </AlertDialogTrigger>
            <AlertDialogBaseContent title="하위 작업을 삭제할까요?" onConfirm={onConfirmDelete} />
          </AlertDialog>
        </Fragment>
      )}
    </Draggable>
  );
};
