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
import { type PropsWithChildren, useState } from 'react';
import { TaskEditFormContent } from '@/components/kanban-task/task-edit-form-content';
import { addTaskSchema, type AddTaskSchema, type ColumnId } from '@/schema';

interface AddTaskProps {
  columnId: ColumnId;
}

const TaskAddDialog = ({ columnId, children }: PropsWithChildren<AddTaskProps>) => {
  const addTask = useKanbanStore.use.addTask();
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<AddTaskSchema>({
    resolver: zodResolver(addTaskSchema),
  });

  const onSubmit: SubmitHandler<AddTaskSchema> = ({ title, description }) => {
    addTask(generateTask(columnId, title, description));
    methods.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}>
            <DialogHeader>
              <DialogTitle>새로운 작업 추가</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <TaskEditFormContent className="py-7" />
            <DialogFooter className="gap-3">
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
