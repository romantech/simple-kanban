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
import { addTaskSchema, type AddTaskSchema, type TaskFields } from '@/lib';
import { EditIcon, Save, Trash2 } from 'lucide-react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { EditTaskFormContent } from '@/components/edit-task-form-content';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { TaskViewContent } from '@/components/task-view-content';
import { useKanbanStore } from '@/store';
import { AnimatePresence, motion } from 'motion/react';

interface SharedTaskProps {
  task: TaskFields;
}

const TaskDialog = ({ children, task }: PropsWithChildren<SharedTaskProps>) => {
  const deleteTask = useKanbanStore.use.deleteTask();
  const editTask = useKanbanStore.use.editTask();

  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleEditMode = () => setIsEditing((prev) => !prev);

  const methods = useForm<AddTaskSchema>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: task,
  });

  const onSubmit: SubmitHandler<AddTaskSchema> = ({ title, description }) => {
    editTask(task.id, title, description);
    toggleEditMode();
  };

  const onDelete = () => {
    deleteTask(task);
    setIsOpen(false);
  };

  const title = isEditing ? 'edit task' : task.title;
  const Icon = isEditing ? Save : EditIcon;
  const editText = isEditing ? '저장' : '수정';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="text-left">{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="capitalize">{title}</DialogTitle>
            <DialogDescription></DialogDescription>

            <div className="-ml-1 flex gap-3 text-baltic-300">
              <button
                onClick={toggleEditMode}
                className="flex items-center rounded transition-transform active:scale-95"
              >
                <Icon height={16} className="transition-colors hover:text-charade-200" />
                <span className="text-sm">{editText}</span>
              </button>
              <ConfirmDialog title="작업을 삭제할까요?" onConfirm={onDelete}>
                <div className="flex items-center transition-transform active:scale-95">
                  <Trash2 height={16} className="transition-colors hover:text-charade-200" />
                  <span className="text-sm">삭제</span>
                </div>
              </ConfirmDialog>
            </div>
          </div>
        </DialogHeader>

        {/* mode="wait" -> 퇴장(exit) 애니메이션이 완료된 후 입장(initial) 애니메이션 실행  */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditing ? 'edit' : 'view'} // key 변경 시 기존 컴포넌트 퇴장 애니메이션 -> 새 컴포넌트 입장 애니메이션
            layout // 레이아웃(크기/위치 등) 변경될 때 애니메이션
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export { TaskDialog };
