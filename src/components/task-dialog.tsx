'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type PropsWithChildren, useState } from 'react';
import { addTaskSchema, type AddTaskSchema, type Task } from '@/lib';
import { EditIcon, Save, Trash2 } from 'lucide-react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { EditTaskFormContent } from '@/components/edit-task-form-content';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { TaskViewContent } from '@/components/task-view-content';

interface SharedTaskProps {
  task: Task;
}

const TaskDialog = ({ children, task }: PropsWithChildren<SharedTaskProps>) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => setIsEditing((prev) => !prev);

  const methods = useForm<AddTaskSchema>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: task,
  });

  const onSubmit: SubmitHandler<AddTaskSchema> = (data) => {
    methods.reset();
    toggleEditMode();
  };

  const onDelete = () => {
    // ..
  };

  const title = isEditing ? '작업 수정' : task.title;
  const Icon = isEditing ? Save : EditIcon;

  return (
    <Dialog>
      <DialogTrigger className="text-left">{children}</DialogTrigger>
      <DialogContent className="min-h-52">
        <DialogHeader>
          <div className="flex flex-col gap-1.5">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription></DialogDescription>
            <div className="-ml-1 flex gap-1 text-baltic-300">
              <button onClick={toggleEditMode} className="rounded">
                <Icon height={16} className="transition-colors hover:text-charade-200" />
              </button>
              <ConfirmDialog title="작업을 삭제할까요?" onConfirm={onDelete}>
                <Trash2 height={16} className="transition-colors hover:text-charade-200" />
              </ConfirmDialog>
            </div>
          </div>
        </DialogHeader>
        {isEditing ? (
          <FormProvider {...methods}>
            <form onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}>
              <EditTaskFormContent className="py-7" />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={toggleEditMode}>
                  취소
                </Button>
                <Button type="submit">완료</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        ) : (
          <TaskViewContent task={task} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export { TaskDialog };
