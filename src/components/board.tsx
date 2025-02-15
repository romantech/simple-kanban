'use client';

import { AddColumnDialog, Column, TaskCard } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { SquarePlus } from 'lucide-react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useId, useState } from 'react';
import { Empty } from '@/components/ui/empty';
import { type ColumnId, getDragTypes, type TaskId } from '@/lib';

const Board = () => {
  // useShallow: 셀렉터 반환값의 얕은 비교(1depth 프로퍼티 비교) 수행
  // 객체/배열 반환 시 내부 프로퍼티 변경을 감지하여 불필요한 리렌더링 방지
  // 단일 원시 타입 값은 기본 Object.is 비교로 충분하므로 useShallow 불필요
  const board = useKanbanStore(useShallow(({ boards, currentBoardId }) => boards[currentBoardId]));

  const editColumnOrder = useKanbanStore.use.editColumnOrder();

  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 }, // 드래그 핸들에 있는 버튼 클릭 가능하도록 10px 이동했을때만 활성
  });

  const [activeColumnId, setActiveColumnId] = useState<ColumnId>();
  const [activeTaskId, setActiveTaskId] = useState<TaskId>();

  const resetActive = () => {
    setActiveColumnId(undefined);
    setActiveTaskId(undefined);
  };

  /**
   * 하이드레이션 에러 해결
   * @see https://github.com/clauderic/dnd-kit/issues/926
   * */
  const dndContextId = useId();

  const onDragStart = ({ active }: DragStartEvent) => {
    if (getDragTypes(active).isActiveTask) setActiveTaskId(active.id as TaskId);
    else setActiveColumnId(active.id as ColumnId);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    resetActive(); // early return 있으므로 최상단에서 초기화 필요

    if (active.id === over?.id) return;

    if (getDragTypes(active).isActiveColumn) {
      const activeIdx = board.columnIds.findIndex((id) => id === active.id);
      const overIdx = board.columnIds.findIndex((id) => id === over?.id);
      const newColumnIds = arrayMove(board.columnIds, activeIdx, overIdx);
      editColumnOrder(board.id, newColumnIds);
    }
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return; // 드롭 영역 벗어났을 때
    if (active.id === over.id) return; // 같은 위치일 때

    const { isActiveTask, isOverTask, isOverColumn } = getDragTypes(active, over);

    if (!isActiveTask) return; // Task Card 드래그가 아닐 때

    const activeTaskColumnId = active.data.current?.columnId as ColumnId;
    const overTaskColumnId = over.data.current?.columnId as ColumnId;

    if (isActiveTask && isOverTask) {
      useKanbanStore.setState((state) => {
        const sourceColumn = state.columns[activeTaskColumnId];
        const targetColumn = state.columns[overTaskColumnId];

        const sourceIdx = sourceColumn.taskIds.findIndex((id) => id === active.id);
        const targetIdx = targetColumn.taskIds.findIndex((id) => id === over.id);
        if (sourceIdx === -1 || targetIdx === -1) return state;

        // 동일 컬럼 내에서 드래그할 때
        if (activeTaskColumnId === overTaskColumnId) {
          sourceColumn.taskIds = arrayMove(sourceColumn.taskIds, sourceIdx, targetIdx);
        } else {
          // 다른 컬럼으로 드래그할 때
          sourceColumn.taskIds.splice(sourceIdx, 1);
          targetColumn.taskIds.splice(targetIdx, 0, active.id as TaskId);
          state.tasks[active.id as TaskId].columnId = overTaskColumnId;
        }
      });
    }

    // 컬럼에 카드가 하나도 없거나, 하나만 있는 상태에서 마지막에 추가할 때(마지막은 컬럼 영역이므로)
    if (isActiveTask && isOverColumn) {
      useKanbanStore.setState((state) => {
        const sourceColumn = state.columns[activeTaskColumnId];
        const targetColumn = state.columns[over.id as ColumnId];

        const sourceIdx = sourceColumn.taskIds.findIndex((id) => id === active.id);
        if (sourceIdx === -1) return state;

        sourceColumn.taskIds.splice(sourceIdx, 1);
        targetColumn.taskIds.push(active.id as TaskId);
        state.tasks[active.id as TaskId].columnId = over.id as ColumnId;
      });
    }
  };

  const isEmpty = board.columnIds.length === 0;

  return (
    <div className="scroll-custom flex w-full gap-4 overflow-x-auto px-6 py-5">
      {isEmpty && <Empty />}
      <DndContext
        id={dndContextId}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        sensors={[mouseSensor]}
      >
        <SortableContext items={board.columnIds} id={board.id}>
          {board.columnIds.map((columnId) => (
            <Column key={columnId} columnId={columnId} />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeColumnId && <Column columnId={activeColumnId} />}
          {activeTaskId && <TaskCard taskId={activeTaskId} />}
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
