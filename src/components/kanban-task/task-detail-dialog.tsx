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
import { type PropsWithChildren, useEffect, useState } from 'react';
import { EditIcon, Save, Trash2 } from 'lucide-react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { TaskEditForm } from '@/components/kanban-task/task-edit-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { AlertDialogBaseContent } from '@/components/ui/alert-dialog-base-content';
import { TaskDetails } from '@/components/kanban-task/task-details';
import { useKanbanStore } from '@/store';
import { AnimatePresence, type AnimationProps, motion } from 'motion/react';
import { IconButton } from '@/components/ui/icon-button';
import { type EditTaskSchema, editTaskSchema, type TaskDef } from '@/schema';
import { formatKoDate } from '@/lib';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useDisclosure } from '@/hooks';
import { toast } from 'sonner';

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

const FORM_ID = 'task-edit-form';

const TaskDetailDialog = ({ children, task, asChild }: PropsWithChildren<SharedTaskProps>) => {
  const deleteTask = useKanbanStore.use.deleteTask();
  const editTask = useKanbanStore.use.editTask();

  const [isEditing, setIsEditing] = useState(false);
  const dialog = useDisclosure();

  const methods = useForm<EditTaskSchema>({
    resolver: zodResolver(editTaskSchema),
    // 변경 > 저장 > 편집 모드로 다시 진입하면 처음 defaultValues로 전달했던 (변경 전)task 값이 그대로 표시됨
    // defaultValues는 언마운트되지 않는 이상 캐시한 값을 그대로 사용하기 때문(캐시 값 변경하려면 reset 사용).
    // 반면, values는 외부에서 전달한 데이터가 변경될 때마다 폼 값을 업데이트함.
    values: task,
  });

  const toggleEditMode = () => setIsEditing((prev) => !prev);

  const onSubmit: SubmitHandler<EditTaskSchema> = ({ title, description }) => {
    editTask(task.id, title, description);
    toggleEditMode();
  };

  const onDeleteTask = () => {
    deleteTask(task);
    dialog.onOpenChange(false);
    toast.success('작업이 삭제되었습니다.');
  };

  useEffect(() => {
    // 모달이 닫힐 때 편집 모드 변경
    if (!dialog.open) setIsEditing(false);
    // 편집 모드로 변경될 때 폼 초기화
    else if (isEditing) methods.reset();
  }, [dialog.open, isEditing, methods]);

  const dialogTitle = isEditing ? '작업 수정' : task.title;

  return (
    <Dialog {...dialog}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>

      <DialogContent className="min-h-80 outline-none">
        <DialogHeader>
          <div className="flex flex-col gap-2">
            <DialogTitle className="mr-auto capitalize">{dialogTitle}</DialogTitle>
            <DialogDescription />

            <div className="flex justify-between text-baltic-300">
              <div className="flex gap-4">
                {!isEditing && <IconButton onClick={toggleEditMode} Icon={EditIcon} label="수정" />}
                {isEditing && <IconButton Icon={Save} label="저장" type="submit" form={FORM_ID} />}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <IconButton Icon={Trash2} label="삭제" />
                  </AlertDialogTrigger>
                  <AlertDialogBaseContent title="작업을 삭제할까요?" onConfirm={onDeleteTask} />
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
                <form id={FORM_ID} onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}>
                  <TaskEditForm className="pb-7 pt-3" />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={toggleEditMode}>
                      취소
                    </Button>
                    <Button type="submit">완료</Button>
                  </DialogFooter>
                </form>
              </FormProvider>
            ) : (
              <TaskDetails task={task} />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export { TaskDetailDialog };
