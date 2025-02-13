'use client';

import { type Column, type ColumnId } from '@/types';
import { AddTask, Task } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Save, Trash2 } from 'lucide-react';

interface ColumnProps {
  columnId: ColumnId;
}

const Column = ({ columnId }: ColumnProps) => {
  const deleteColumn = useKanbanStore.use.deleteColumn();
  const setColumnTitle = useKanbanStore.use.setColumnTitle();

  const { tasks, column } = useKanbanStore(
    useShallow(({ tasks, columns }) => ({ tasks, column: columns[columnId] })),
  );

  const tasksByColumnId = column.taskIds.map((id) => tasks[id]);

  return (
    <div className="flex w-64 shrink-0 flex-col gap-4">
      <ColumnHeader
        title={column.title}
        taskCount={tasksByColumnId.length}
        onDelete={() => deleteColumn(columnId)}
        onTitleChange={(newTitle) => setColumnTitle(columnId, newTitle)}
      />
      <AddTask columnId={columnId} />
      <ul className="scroll-custom flex flex-1 flex-col gap-4 overflow-y-auto">
        {tasksByColumnId.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

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

  const EditIcon = isEditing ? Save : Pencil;

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
        <h3 className="text-sm font-bold">{`${title} (${taskCount})`}</h3>
      )}

      <div className="flex">
        <button onClick={toggleIsEditing} className="rounded">
          <EditIcon height={14} className="transition-colors hover:text-charade-200" />
        </button>

        <AlertDialog>
          <AlertDialogTrigger className="rounded p-0.5">
            <Trash2 height={14} className="transition-colors hover:text-charade-200" />
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>컬럼을 삭제할까요?</AlertDialogTitle>
              <AlertDialogDescription>
                컬럼을 삭제하면 해당 컬럼에 있는 모든 작업이 삭제돼요. 삭제할까요?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>삭제</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export { Column };
