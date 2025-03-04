'use client';

import { Column, ColumnAddDialog, Task } from '@/components';
import { useKanbanStore } from '@/store';
import { Button } from '@/components/ui/button';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { toColumnId, toTaskId } from '@/types';
import { useKanbanDnd } from '@/hooks';
import { AnimatePresence } from 'motion/react';
import { Empty } from '@/components/ui/empty';

const Board = () => {
  const board = useKanbanStore(({ boards, currentBoardId }) => boards[currentBoardId]);
  const addPreset = useKanbanStore.use.addPreset();

  const { handlers, dndContextId, dragColumnId, dragTaskId, sensors } = useKanbanDnd();

  const isEmpty = board.columnIds.length === 0;

  return (
    <div className="scroll-custom flex w-full gap-4 overflow-x-auto px-6 py-5">
      <AnimatePresence mode="wait">
        {isEmpty ? (
          <Empty key={board.id}>
            <Button onClick={() => addPreset(board.id)} className="font-bold">
              기본 컬럼 추가
            </Button>
          </Empty>
        ) : (
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
        )}
      </AnimatePresence>

      <div className="ml-auto mt-11 flex">
        <ColumnAddDialog boardId={board.id}>
          <Button className="hidden h-full w-[210px] items-center justify-center gap-1 rounded-md bg-baltic-900/30 text-xl font-bold capitalize text-baltic-400 shadow-md transition-all hover:bg-baltic-900/50 active:scale-95 lg:flex">
            add column
          </Button>
        </ColumnAddDialog>
      </div>
    </div>
  );
};

export { Board };
