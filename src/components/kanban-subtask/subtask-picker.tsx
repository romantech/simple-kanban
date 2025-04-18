'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { type UseDisclosure, useMediaQuery } from '@/hooks';
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
const SUBTASK_PICKER_FORM_ID = 'subtask-picker-form';

const filterActiveSubtasks = (subtasks: z.infer<typeof subtaskListSchema>) => {
  return subtasks.filter((subtask) => {
    return subtask.checked && subtask.title.trim().length > 0;
  });
};

interface SubtaskPickerProps extends UseDisclosure {
  subtaskList: string[];
  parentTask: TaskDef;
  showOverwriteButton?: boolean;
}

export const SubtaskPicker = ({
  parentTask,
  open,
  onOpenChange,
  subtaskList,
  showOverwriteButton = false,
}: SubtaskPickerProps) => {
  const addSubtask = useKanbanStore.use.addSubtask();
  const clearAIGeneratedSubtasks = useKanbanStore.use.clearAIGeneratedSubtasks();

  const isTabletScreen = useMediaQuery('md');

  const { register, control, handleSubmit, getValues } = useForm<SubtaskPickerSchema>({
    values: { subtasks: subtaskList.map((title) => ({ title, checked: true })) },
    resolver: zodResolver(subtaskPickerSchema),
  });

  const processSubtasks = ({ subtasks }: SubtaskPickerSchema, overwrite = false) => {
    if (overwrite) clearAIGeneratedSubtasks(parentTask.id);

    const filteredSubtasks = filterActiveSubtasks(subtasks);

    if (filteredSubtasks.length > 0) {
      filteredSubtasks.forEach(({ title }) => {
        const subtask = generateSubtask({ taskId: parentTask.id, title, generatedByAI: true });
        addSubtask(subtask, false);
      });
    }

    onOpenChange(false);
  };

  const onSubmit = (data: SubtaskPickerSchema) => processSubtasks(data, false);
  const onOverwrite = () => processSubtasks(getValues(), true);

  const sheetPosition = isTabletScreen ? 'right' : 'bottom';

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        side={sheetPosition}
        className="space-y-6"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>하위 작업 선택</SheetTitle>
          <SheetDescription className="whitespace-pre-line">{`"${parentTask.title}"에 대해 자동 생성된 하위 작업 목록입니다.\n하위 작업 이름은 수정할 수 있습니다.`}</SheetDescription>
        </SheetHeader>
        <form id={SUBTASK_PICKER_FORM_ID} onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          {subtaskList.map((_, i) => (
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
          {showOverwriteButton && (
            <Button type="button" variant="outline" onClick={onOverwrite}>
              기존 AI 하위 작업 덮어쓰기
            </Button>
          )}
          <Button type="submit" form={SUBTASK_PICKER_FORM_ID}>
            선택 항목 추가
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
