import { CirclePlus } from 'lucide-react';
import { type ColumnId } from '@/types';
import { useKanbanStore } from '@/store';

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
      className="flex w-full cursor-pointer items-center justify-start gap-2 rounded-md border border-baltic-900 p-3 text-sm shadow-md transition-all hover:bg-charade-950 active:scale-95"
    >
      <CirclePlus height={16} />
      Add Task
    </button>
  );
};

export { AddTask };
