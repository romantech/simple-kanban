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
import { type PropsWithChildren } from 'react';
import { TaskEditForm } from '@/components/kanban-task/task-edit-form';
import { addTaskSchema, type AddTaskSchema, type ColumnId } from '@/schema';
import { useDisclosure } from '@/hooks';

interface AddTaskProps {
  columnId: ColumnId;
}

const TaskAddDialog = ({ columnId, children }: PropsWithChildren<AddTaskProps>) => {
  const addTask = useKanbanStore.use.addTask();
  const dialog = useDisclosure();

  const methods = useForm<AddTaskSchema>({ resolver: zodResolver(addTaskSchema) });

  const onOpenChangeWithReset = (open: boolean) => {
    if (open) methods.reset();
    dialog.onOpenChange(open);
  };

  const onSubmit: SubmitHandler<AddTaskSchema> = ({ title, description }) => {
    addTask(generateTask(columnId, title, description));
    onOpenChangeWithReset(false);
  };

  return (
    <Dialog open={dialog.open} onOpenChange={onOpenChangeWithReset}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}>
            <DialogHeader>
              <DialogTitle>새로운 작업 추가</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <TaskEditForm className="py-7" />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  취소
                </Button>
              </DialogClose>
              <Button type="submit">추가</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export { TaskAddDialog };
