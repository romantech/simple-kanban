'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { type UseDisclosure } from '@/hooks';
import { Controller, useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn, generateSubtask } from '@/lib';
import { Input } from '@/components/ui/input';
import { type TaskDef } from '@/schema';
import { useKanbanStore } from '@/store';

interface SubtaskSelectSheetProps extends UseDisclosure {
  subtaskTitles: string[];
  task: TaskDef;
}

const subtaskSelectFormSchema = z.object({
  subtasks: z.array(z.object({ title: z.string(), checked: z.boolean() })),
});
type SubtaskSelectForm = z.infer<typeof subtaskSelectFormSchema>;
const formName = 'subtask-select-form';

export const SubtaskSelectSheet = ({
  open,
  onOpenChange,
  subtaskTitles,
  task,
}: SubtaskSelectSheetProps) => {
  const addSubtask = useKanbanStore.use.addSubtask();

  const { register, control, handleSubmit, reset } = useForm<SubtaskSelectForm>({
    values: {
      subtasks: subtaskTitles.map((title) => ({ title, checked: true })),
    },
    resolver: zodResolver(subtaskSelectFormSchema),
  });

  const onOpenChangeWithReset = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const onSubmit = ({ subtasks }: SubtaskSelectForm) => {
    const filteredSubtasks = subtasks.filter((subtask) => {
      return subtask.checked && Boolean(subtask.title.trim());
    });

    if (filteredSubtasks.length > 0) {
      filteredSubtasks.forEach(({ title }) => {
        const subtask = generateSubtask({ taskId: task.id, title, generatedByAI: true });
        addSubtask(subtask, false);
      });
    }

    onOpenChangeWithReset(false);
  };

  return (
    <Sheet onOpenChange={onOpenChangeWithReset} open={open}>
      <SheetContent className="space-y-6" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>하위 작업 선택</SheetTitle>
          <SheetDescription>{`"${task.title}" 작업에 대한 하위 작업을 추가하세요. 하위 작업 이름은 수정할 수 있습니다.`}</SheetDescription>
        </SheetHeader>
        <form id={formName} onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          {subtaskTitles.map((_, i) => (
            <div className="flex items-center" key={i}>
              <Controller
                control={control}
                name={`subtasks.${i}.checked`}
                render={({ field }) => (
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Input
                {...register(`subtasks.${i}.title`)}
                className={cn('border-none focus-visible:ring-0')}
              />
            </div>
          ))}
        </form>
        <SheetFooter>
          <Button type="submit" form={formName}>
            선택한 작업 추가
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
