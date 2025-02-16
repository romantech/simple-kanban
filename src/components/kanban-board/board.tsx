'use client';

import { Column, ColumnAddDialog, Task } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { SquarePlus } from 'lucide-react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { toColumnId, toTaskId } from '@/types';
import { useKanbanDnd } from '@/hooks';
import { AnimatePresence } from 'motion/react';
import { Empty } from '@/components/ui/empty';

const Board = () => {
  // useShallow: 셀렉터 반환값의 얕은 비교(1depth 프로퍼티 비교) 수행
  // 객체/배열 반환 시 내부 프로퍼티 변경을 감지하여 불필요한 리렌더링 방지
  // 단일 원시 타입 값은 기본 Object.is 비교로 충분하므로 useShallow 불필요
  const board = useKanbanStore(useShallow(({ boards, currentBoardId }) => boards[currentBoardId]));

  const { handlers, dndContextId, dragColumnId, dragTaskId, sensors } = useKanbanDnd();

  const isEmpty = board.columnIds.length === 0;

  return (
    <div className="scroll-custom flex w-full gap-4 overflow-x-auto px-6 py-5">
      <AnimatePresence>{isEmpty && <Empty />}</AnimatePresence>
      <DndContext
        id={dndContextId}
        sensors={sensors}
        modifiers={[restrictToWindowEdges]}
        {...handlers}
      >
        <SortableContext items={board.columnIds} id={board.id}>
          {board.columnIds.map((columnId) => (
            <Column key={columnId} columnId={columnId} />
          ))}
        </SortableContext>
        <DragOverlay>
          {dragColumnId && <Column columnId={toColumnId(dragColumnId)} />}
          {dragTaskId && <Task taskId={toTaskId(dragTaskId)} />}
        </DragOverlay>
      </DndContext>

      <div className="ml-auto mt-11 flex">
        <ColumnAddDialog boardId={board.id}>
          <Button className="hidden h-full w-[210px] items-center justify-center gap-1 rounded-md bg-baltic-900/30 text-xl font-bold capitalize text-baltic-400 shadow-md outline-none transition-all hover:bg-baltic-900/50 active:scale-95 lg:flex">
            <SquarePlus height={20} /> add column
          </Button>
        </ColumnAddDialog>
      </div>
    </div>
  );
};

export { Board };
