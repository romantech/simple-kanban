'use client';

import { Board, BoardList, Header } from '@/components';

const Kanban = () => {
  return (
    <div className="flex size-full flex-col">
      <Header />
      <div className="flex flex-1">
        <BoardList />
        <Board />
      </div>
    </div>
  );
};

export { Kanban };
