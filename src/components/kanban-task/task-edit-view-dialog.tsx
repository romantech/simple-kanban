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
import { EditIcon, Save, Trash2 } from 'lucide-react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { TaskEditFormContent } from '@/components/kanban-task/task-edit-form-content';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { AlertDialogBaseContent } from '@/components/ui/alert-dialog-base-content';
import { TaskViewContent } from '@/components/kanban-task/task-view-content';
import { useKanbanStore } from '@/store';
import { AnimatePresence, type AnimationProps, motion } from 'motion/react';
import { IconButton } from '@/components/ui/icon-button';
import { addTaskSchema, type AddTaskSchema, type TaskDef } from '@/schema';
import { formatKoDate } from '@/lib';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface SharedTaskProps {
  task: TaskDef;
  asChild?: boolean;
}

const animationVariants: AnimationProps = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.08 },
};

const TaskEditViewDialog = ({ children, task, asChild }: PropsWithChildren<SharedTaskProps>) => {
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

  const title = isEditing ? '작업 수정' : task.title;
  const Icon = isEditing ? Save : EditIcon;
  const editText = isEditing ? '저장' : '수정';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>

      <DialogContent className="outline-none">
        <DialogHeader>
          <div className="flex flex-col gap-2">
            <DialogTitle className="mr-auto capitalize">{title}</DialogTitle>
            <DialogDescription></DialogDescription>

            <div className="flex justify-between text-baltic-300">
              <div className="flex gap-4">
                <IconButton onClick={toggleEditMode} Icon={Icon} label={editText} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <IconButton Icon={Trash2} label="삭제" />
                  </AlertDialogTrigger>
                  <AlertDialogBaseContent title="작업을 삭제할까요?" onConfirm={onDelete} />
                </AlertDialog>
              </div>
              <small className="text-sm">{`생성일: ${formatKoDate(task.createdAt)}`}</small>
            </div>
          </div>
        </DialogHeader>

        {/* mode="wait" -> 퇴장(exit) 애니메이션이 완료된 후 입장(initial) 애니메이션 실행  */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditing ? 'edit' : 'view'} // key 변경 시 기존 컴포넌트 퇴장 애니메이션 -> 새 컴포넌트 입장 애니메이션
            layout // 레이아웃(크기/위치 등) 변경될 때 애니메이션
            {...animationVariants}
          >
            {isEditing ? (
              <FormProvider {...methods}>
                <form onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}>
                  <TaskEditFormContent className="py-7" />
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

export { TaskEditViewDialog };
