'use client';

import { type ChangeEvent, type HTMLAttributes, type KeyboardEvent, useState } from 'react';
import { EditIcon, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib';
import { IconButton } from '@/components/ui/icon-button';

interface ColumnHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  taskCount: number;
  onDelete: () => void;
  onTitleChange: (title: string) => void;
}

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
      {isEditing ? (
        <Input
          value={editedTitle}
          onChange={onInputChange}
          onBlur={saveTitle}
          onKeyDown={onKeyDown}
          className="h-6 px-2 font-bold focus-visible:ring-0"
          autoFocus
        />
      ) : (
        <h3 className="line-clamp-1 text-sm font-bold">{`${title} (${taskCount})`}</h3>
      )}

      <div className="flex gap-2">
        <IconButton onClick={toggleIsEditing} Icon={Icon} />
        <ConfirmDialog
          title="컬럼을 삭제할까요?"
          description="컬럼을 삭제하면 해당 컬럼에 있는 모든 작업이 삭제돼요."
          onConfirm={onDelete}
        >
          <IconButton as="div" onClick={toggleIsEditing} Icon={Trash2} />
        </ConfirmDialog>
      </div>
    </div>
  );
};

export { ColumnHeader };
