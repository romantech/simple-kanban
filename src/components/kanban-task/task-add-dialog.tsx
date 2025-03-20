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
import { SubtaskPicker } from '@/components';
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

  const form = useForm<AddTaskSchema>({
    resolver: zodResolver(addTaskSchema),
    shouldUnregister: true, // 언마운트 시 필드 값 초기화 (자식 컴포넌트에서도 적용됨)
  });

  const onSubmit: SubmitHandler<AddTaskSchema> = async ({ title, description, autoSubtasks }) => {
    if (autoSubtasks) {
      await runAsync({ title, description });
      sheet.onOpenChange(true);
    }

    tempTask.current = generateTask({ title, description, columnId });
    addTask(tempTask.current);
    dialog.onOpenChange(false);
  };

  return (
    <Fragment>
      <Dialog open={dialog.open} onOpenChange={dialog.onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <FormProvider {...form}>
            <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
              <DialogHeader>
                <DialogTitle>새로운 작업 추가</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <TaskEditForm className="py-7" autoSubtasks />
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
        <SubtaskPicker task={tempTask.current} subtaskTitles={data} {...sheet} />
      )}
    </Fragment>
  );
};

export { TaskAddDialog };
