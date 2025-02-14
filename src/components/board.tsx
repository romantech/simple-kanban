'use client';

import { AddColumnDialog, Column } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { SquarePlus } from 'lucide-react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useState } from 'react';
import { type ColumnId } from '@/lib';
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

const Board = () => {
  // useShallow: 셀렉터 반환값의 "얕은 비교" 수행
  // 객체/배열 반환 시 내부 프로퍼티 변경을 감지하여 불필요한 리렌더링 방지
  // 단일 원시 타입 값은 기본 비교로 충분하므로 useShallow 불필요
  const board = useKanbanStore(useShallow(({ boards, currentBoardId }) => boards[currentBoardId]));

  const editColumnOrder = useKanbanStore.use.editColumnOrder();

  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 }, // 드래그 핸들에 있는 버튼 클릭 가능하도록 10px 이동했을때만 활성
  });

  const [activeId, setActiveId] = useState<ColumnId>();

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as ColumnId);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id === over?.id) return;

    const oldIndex = board.columnIds.findIndex((id) => id === active.id);
    const newIndex = board.columnIds.findIndex((id) => id === over?.id);

    const newColumnIds = arrayMove(board.columnIds, oldIndex, newIndex);
    editColumnOrder(board.id, newColumnIds);
  };

  return (
    <div className="scroll-custom flex w-full gap-4 overflow-x-auto p-6">
      <DndContext
        onDragEnd={onDragEnd}
        onDragStart={onDragStart}
        modifiers={[restrictToHorizontalAxis]}
        sensors={[mouseSensor]}
      >
        <SortableContext items={board.columnIds}>
          {board.columnIds.map((columnId) => (
            <Column key={columnId} columnId={columnId} />
          ))}
        </SortableContext>
        <DragOverlay modifiers={[restrictToParentElement]}>
          {activeId && <Column columnId={activeId} className="pointer-events-none" />}
        </DragOverlay>
      </DndContext>

      <div className="ml-auto mt-11 flex">
        <AddColumnDialog boardId={board.id}>
          <Button className="flex h-full w-[210px] items-center justify-center gap-1 rounded-md bg-baltic-900/30 text-xl font-bold capitalize text-baltic-400 shadow-md outline-none transition-all hover:bg-baltic-900/50 active:scale-95">
            <SquarePlus height={20} /> add column
          </Button>
        </AddColumnDialog>
      </div>
    </div>
  );
};

export { Board };
