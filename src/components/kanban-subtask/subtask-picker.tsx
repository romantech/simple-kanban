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

const subtaskListSchema = z.array(z.object({ title: z.string(), checked: z.boolean() }));
const subtaskPickerSchema = z.object({ subtasks: subtaskListSchema });

type SubtaskPickerSchema = z.infer<typeof subtaskPickerSchema>;
const subtaskPickerFormName = 'subtask-picker-form';

const filterActiveSubtasks = (subtasks: z.infer<typeof subtaskListSchema>) => {
  return subtasks.filter((subtask) => {
    return subtask.checked && subtask.title.trim().length > 0;
  });
};

interface SubtaskPickerProps extends UseDisclosure {
  subtaskTitles: string[];
  task: TaskDef;
}

export const SubtaskPicker = ({ open, onOpenChange, subtaskTitles, task }: SubtaskPickerProps) => {
  const addSubtask = useKanbanStore.use.addSubtask();

  const { register, control, handleSubmit } = useForm<SubtaskPickerSchema>({
    values: { subtasks: subtaskTitles.map((title) => ({ title, checked: true })) },
    resolver: zodResolver(subtaskPickerSchema),
  });

  const onSubmit = ({ subtasks }: SubtaskPickerSchema) => {
    const filteredSubtasks = filterActiveSubtasks(subtasks);

    if (filteredSubtasks.length > 0) {
      filteredSubtasks.forEach(({ title }) => {
        const subtask = generateSubtask({ taskId: task.id, title, generatedByAI: true });
        addSubtask(subtask, false);
      });
    }

    onOpenChange(false);
  };

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="space-y-6" onInteractOutside={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>하위 작업 선택</SheetTitle>
          <SheetDescription>{`"${task.title}"에 대해 자동 생성된 하위 작업 목록입니다. 하위 작업 이름은 수정할 수 있습니다.`}</SheetDescription>
        </SheetHeader>
        <form id={subtaskPickerFormName} onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
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
          <Button type="submit" form={subtaskPickerFormName}>
            선택한 작업 추가
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
