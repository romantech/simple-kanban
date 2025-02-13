import { CirclePlus } from 'lucide-react';
import { useKanbanStore } from '@/store';
import { type ColumnId } from '@/lib';

interface AddTaskProps {
  columnId: ColumnId;
}

const AddTask = ({ columnId }: AddTaskProps) => {
  const addTask = useKanbanStore.use.addTask();

  const onClick = () => {
    addTask(columnId, 'Test');
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-start gap-1 rounded-md border border-baltic-900 p-2 text-xs font-semibold capitalize text-baltic-200 shadow-md transition-all hover:bg-charade-950 active:scale-95"
    >
      <CirclePlus height={14} />
      add task
    </button>
  );
};

export { AddTask };
