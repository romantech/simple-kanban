import { sampleKanbanData } from '@/lib';
import { Board } from '@/components';

const { boards, ...boardProps } = sampleKanbanData;

const Kanban = () => {
  const board = boards['board-1'];
  return (
    <div>
      <Board board={board} {...boardProps} />
    </div>
  );
};

export { Kanban };
