'use client';

import { type HTMLAttributes, type KeyboardEvent, useRef, useState } from 'react';
import { EditIcon, GripVertical, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn, ColumnConfig } from '@/lib';
import { IconButton } from '@/components/ui/icon-button';
import { AnimatePresence, motion, type MotionProps } from 'motion/react';
import { type ColumnDef, columnSchema } from '@/schema';
import { useKanbanStore } from '@/store';
import { useShakeAnimation } from '@/hooks';

interface ColumnHeaderProps extends HTMLAttributes<HTMLDivElement> {
  column: ColumnDef;
}

const fadeScaleAnimation: MotionProps = {
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  exit: { scaleX: 0, opacity: 0 },
  transition: { duration: 0.15 },
};

const ColumnHeader = ({ column, className, ...divProps }: ColumnHeaderProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { triggerShake, isShaking } = useShakeAnimation();

  const deleteColumn = useKanbanStore.use.deleteColumn();
  const editColumn = useKanbanStore.use.editColumn();

  const saveTitle = () => {
    if (inputRef.current === null) return;

    const result = columnSchema.shape.title.safeParse(inputRef.current.value);
    if (!result.success) return triggerShake();

    editColumn(column.id, result.data);
    setIsEditMode(false);
  };

  const handleEditOrSave = () => {
    if (isEditMode) saveTitle();
    else setIsEditMode(true);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') saveTitle();
    else if (event.key === 'Escape') setIsEditMode(false);
  };

  const onBlur = () => setIsEditMode(false);

  const onConfirmDelete = () => deleteColumn(column);

  const Icon = isEditMode ? Save : EditIcon;

  return (
    <div
      className={cn(
        'mb-2 flex h-[24px] cursor-grab items-center justify-between gap-2 text-baltic-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:rounded',
        className,
      )}
      {...divProps}
    >
      <GripVertical className="size-5 flex-none" />
      <AnimatePresence mode="wait">
        {isEditMode ? (
          <motion.div
            key="input"
            {...fadeScaleAnimation}
            className={cn('grow', { 'animate-shake': isShaking })}
          >
            <Input
              ref={inputRef}
              defaultValue={column.title}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
              className="h-7 px-2 font-bold"
              maxLength={ColumnConfig.title.max}
              minLength={ColumnConfig.title.min}
              placeholder={`${ColumnConfig.title.min} ~ ${ColumnConfig.title.max} 글자`}
              autoFocus
            />
          </motion.div>
        ) : (
          <motion.h3
            key="title"
            {...fadeScaleAnimation}
            style={{ transformOrigin: 'left' }}
            className="line-clamp-1 grow text-[15px] font-bold"
          >
            {`${column.title} (${column.taskIds.length})`}
          </motion.h3>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <ConfirmDialog
          title="컬럼을 삭제할까요?"
          description="컬럼을 삭제하면 해당 컬럼에 있는 모든 작업이 삭제돼요."
          onConfirm={onConfirmDelete}
          asChild
        >
          {!isEditMode && <IconButton Icon={Trash2} />}
        </ConfirmDialog>
        <IconButton onClick={handleEditOrSave} Icon={Icon} />
      </div>
    </div>
  );
};

export { ColumnHeader };
