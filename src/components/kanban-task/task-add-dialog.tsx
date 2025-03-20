'use client';

import { useKanbanStore } from '@/store';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { generateTask } from '@/lib';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Fragment, type PropsWithChildren, useRef } from 'react';
import { TaskEditForm } from '@/components/kanban-task/task-edit-form';
import { addTaskSchema, type AddTaskSchema, type ColumnId, type TaskDef } from '@/schema';
import { useDisclosure } from '@/hooks';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { BadgeAI } from '@/components/ui/badge-ai';
import { SubtaskSelectSheet } from '@/components';
import { useRequest } from 'ahooks';
import { type GenerateAISubtasks, generateAISubtasks } from '@/services/subtask';
import { toast } from 'sonner';

interface AddTaskProps {
  columnId: ColumnId;
}

const TaskAddDialog = ({ columnId, children }: PropsWithChildren<AddTaskProps>) => {
  const addTask = useKanbanStore.use.addTask();
  const dialog = useDisclosure();
  const sheet = useDisclosure();
  const tempTask = useRef<TaskDef>(null);

  const { runAsync, loading, data } = useRequest(
    (params: GenerateAISubtasks) => generateAISubtasks(params),
    {
      manual: true,
      onSuccess: (data) =>
        toast.success(`하위 작업 ${data.length}개가 생성되었습니다.`, { position: 'bottom-left' }),
      onError: () => toast.error('하위 작업 생성에 실패했습니다.'),
    },
  );
  const form = useForm<AddTaskSchema>({ resolver: zodResolver(addTaskSchema) });

  const onOpenChangeWithReset = (open: boolean) => {
    if (open) form.reset();
    dialog.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<AddTaskSchema> = async ({ title, description, autoSubtasks }) => {
    if (autoSubtasks) {
      await runAsync({ title, description });
      sheet.onOpenChange(true);
    }

    tempTask.current = generateTask({ title, description, columnId });
    addTask(tempTask.current);
    onOpenChangeWithReset(false);
  };

  return (
    <Fragment>
      <Dialog open={dialog.open} onOpenChange={onOpenChangeWithReset}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <FormProvider {...form}>
            <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
              <DialogHeader>
                <DialogTitle>새로운 작업 추가</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-5 py-7">
                <TaskEditForm />
                <FormField
                  control={form.control}
                  name="autoSubtasks"
                  render={({ field }) => (
                    <FormItem className="relative flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-2 leading-none">
                        <FormLabel>
                          하위 작업 자동 생성 <BadgeAI />
                        </FormLabel>
                        <FormDescription>
                          작업 이름과 설명을 기반으로 하위 작업을 자동 생성합니다. (최대 10개)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </DialogClose>
                <Button disabled={loading} type="submit">
                  {loading ? '생성중...' : '추가'}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
      {tempTask.current && data && (
        <SubtaskSelectSheet task={tempTask.current} subtaskTitles={data} {...sheet} />
      )}
    </Fragment>
  );
};

export { TaskAddDialog };
