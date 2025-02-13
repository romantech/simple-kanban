'use client';

import { useState } from 'react';
import { EditIcon, Save, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface ColumnHeaderProps {
  title: string;
  taskCount: number;
  onDelete: () => void;
  onTitleChange: (title: string) => void;
}

const ColumnHeader = ({ title, taskCount, onDelete, onTitleChange }: ColumnHeaderProps) => {
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveTitle();
    else if (e.key === 'Escape') setIsEditing(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const Icon = isEditing ? Save : EditIcon;

  return (
    <div className="mb-2 flex h-[24px] items-center justify-between gap-2 text-baltic-400">
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

      <div className="flex">
        <button onClick={toggleIsEditing} className="rounded">
          <Icon height={14} className="transition-colors hover:text-charade-200" />
        </button>
        <ConfirmDialog
          title="컬럼을 삭제할까요?"
          description="컬럼을 삭제하면 해당 컬럼에 있는 모든 작업이 삭제돼요."
          onConfirm={onDelete}
        >
          <Trash2 height={14} className="rounded transition-colors hover:text-charade-200" />
        </ConfirmDialog>
      </div>
    </div>
  );
};

export { ColumnHeader };
