import { SquarePlus } from 'lucide-react';
import { useKanbanStore } from '@/store';

const AddColumn = () => {
  const addColumn = useKanbanStore.use.addColumn();

  const onClick = () => {
    addColumn('Test');
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-[210px] items-center justify-center gap-1 rounded-md bg-baltic-900/30 text-xl font-bold capitalize text-baltic-400 shadow-md outline-none transition-all hover:bg-baltic-900/50 active:scale-95"
    >
      <SquarePlus height={20} /> add column
    </button>
  );
};

export { AddColumn };
