'use client';

import { type ChangeEvent, type HTMLAttributes, type KeyboardEvent, useState } from 'react';
import { EditIcon, GripVertical, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib';
import { IconButton } from '@/components/ui/icon-button';
import { AnimatePresence, motion, type MotionProps } from 'motion/react';

interface ColumnHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  taskCount: number;
  onDelete: () => void;
  onTitleChange: (title: string) => void;
}

const fadeScaleAnimation: MotionProps = {
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  exit: { scaleX: 0, opacity: 0 },
  transition: { duration: 0.2 },
};

const ColumnHeader = ({
  title,
  taskCount,
  onDelete,
  onTitleChange,
  className,
  ...divProps
}: ColumnHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const saveTitle = () => {
    const trimmed = editedTitle.trim();
    if (trimmed.length === 0) return;

    onTitleChange(trimmed);
    setIsEditing(false);
  };

  const toggleIsEditing = () => {
    if (isEditing) saveTitle();
    else setIsEditing(true);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') saveTitle();
    else if (event.key === 'Escape') setIsEditing(false);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const Icon = isEditing ? Save : EditIcon;

  return (
    <div
      className={cn(
        'mb-2 flex h-[24px] cursor-grab items-center justify-between gap-2 text-baltic-400',
        className,
      )}
      {...divProps}
    >
      <GripVertical className="size-5 flex-none" />
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="input"
            {...fadeScaleAnimation}
            style={{ transformOrigin: 'right' }}
            className="grow"
          >
            <Input
              value={editedTitle}
              onChange={onInputChange}
              onBlur={saveTitle}
              onKeyDown={onKeyDown}
              className="h-6 px-2 font-bold focus-visible:ring-0"
              autoFocus
            />
          </motion.div>
        ) : (
          <motion.h3
            key="title"
            {...fadeScaleAnimation}
            style={{ transformOrigin: 'left' }}
            className="line-clamp-1 grow text-sm font-bold"
          >
            {`${title} (${taskCount})`}
          </motion.h3>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <ConfirmDialog
          title="컬럼을 삭제할까요?"
          description="컬럼을 삭제하면 해당 컬럼에 있는 모든 작업이 삭제돼요."
          onConfirm={onDelete}
          asChild
        >
          {!isEditing && <IconButton Icon={Trash2} />}
        </ConfirmDialog>
        <IconButton onClick={toggleIsEditing} Icon={Icon} />
      </div>
    </div>
  );
};

export { ColumnHeader };
