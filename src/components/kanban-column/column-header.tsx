'use client';

import { type HTMLAttributes, type KeyboardEvent, useRef, useState } from 'react';
import { EditIcon, GripVertical, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AlertDialogBaseContent } from '@/components/ui/alert-dialog-base-content';
import { cn, ColumnConfig } from '@/lib';
import { IconButton } from '@/components/ui/icon-button';
import { AnimatePresence, motion, type MotionProps } from 'motion/react';
import { type ColumnDef, columnSchema } from '@/schema';
import { useKanbanStore } from '@/store';
import { useShakeAnimation } from '@/hooks';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';

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

  const EditOrSaveIcon = isEditMode ? Save : EditIcon;
  const tooltipContent = isEditMode ? '컬럼 제목 저장' : '컬럼 제목 수정';

  return (
    <div
      className={cn(
        'mb-2 flex h-[24px] cursor-grab items-center justify-between gap-2 text-baltic-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:rounded',
        className,
      )}
      role="region"
      aria-labelledby={`column-title-${column.id}`}
      {...divProps}
    >
      <GripVertical className="size-5 flex-none" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {isEditMode ? (
          <motion.div
            key="input"
            className={cn('grow origin-right', { 'animate-shake': isShaking })}
            {...fadeScaleAnimation}
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
              aria-label="컬럼 제목 편집"
              aria-invalid={isShaking ? 'true' : 'false'}
              aria-errormessage={isShaking ? 'titleError' : undefined}
            />
            {isShaking && (
              <div id="titleError" className="sr-only" role="alert">
                제목은 {ColumnConfig.title.min}자에서 {ColumnConfig.title.max}자 사이여야 합니다.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.h3
            key="title"
            className="line-clamp-1 grow origin-left text-[15px] font-bold"
            aria-live="polite"
            id={`column-title-${column.id}`}
            {...fadeScaleAnimation}
          >
            {`${column.title} (${column.taskIds.length})`}
          </motion.h3>
        )}
      </AnimatePresence>

      <div className="flex gap-3" role="group" aria-label="컬럼 작업">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {!isEditMode && (
              <IconButton aria-label="컬럼 삭제" Icon={Trash2} tooltipContent="컬럼 삭제" />
            )}
          </AlertDialogTrigger>
          <AlertDialogBaseContent
            title="컬럼을 삭제할까요?"
            description="컬럼에 있는 모든 작업도 함께 삭제돼요."
            onConfirm={onConfirmDelete}
          />
        </AlertDialog>
        <IconButton
          onClick={handleEditOrSave}
          Icon={EditOrSaveIcon}
          tooltipContent={tooltipContent}
          aria-label={tooltipContent}
          aria-pressed={isEditMode}
        />
      </div>
    </div>
  );
};

export { ColumnHeader };
