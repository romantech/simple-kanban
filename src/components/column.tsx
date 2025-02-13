import { type Column, type ColumnId } from '@/types';
import { AddTask, Task } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { Trash2 } from 'lucide-react';
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

interface ColumnProps {
  columnId: ColumnId;
}

const Column = ({ columnId }: ColumnProps) => {
  const deleteColumn = useKanbanStore.use.deleteColumn();
  const { tasks, column } = useKanbanStore(
    useShallow(({ tasks, columns }) => ({ tasks, column: columns[columnId] })),
  );

  const tasksByColumnId = column.taskIds.map((id) => tasks[id]);

  return (
    <div className="flex w-64 shrink-0 flex-col space-y-4">
      <ColumnHeader
        title={column.title}
        taskCount={tasksByColumnId.length}
        onDelete={() => deleteColumn(columnId)}
      />
      <AddTask columnId={columnId} />
      <ul className="scroll-custom flex flex-col gap-4 overflow-y-auto">
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
}

const ColumnHeader = ({ title, taskCount, onDelete }: ColumnHeaderProps) => {
  return (
    <div className="mb-2 flex items-center justify-between text-baltic-400">
      <h3 className="text-sm font-bold">{`${title} (${taskCount})`}</h3>
      <AlertDialog>
        <AlertDialogTrigger>
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
  );
};

export { Column };
