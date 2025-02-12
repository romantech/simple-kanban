import { Board } from '@/components';
import { initialBoardId } from '@/lib';

const Kanban = () => {
  return (
    <div>
      <Board boardId={initialBoardId} />
    </div>
  );
};

export { Kanban };
