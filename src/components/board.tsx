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
import { useId } from 'react';
import { Empty } from '@/components/ui/empty';
import { getDragTypes } from '@/lib';
import { useDragState } from '@/hooks';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { type Sortable, toColumnId, toTaskId } from '@/types';

const Board = () => {
  // useShallow: 셀렉터 반환값의 얕은 비교(1depth 프로퍼티 비교) 수행
  // 객체/배열 반환 시 내부 프로퍼티 변경을 감지하여 불필요한 리렌더링 방지
  // 단일 원시 타입 값은 기본 Object.is 비교로 충분하므로 useShallow 불필요
  const board = useKanbanStore(useShallow(({ boards, currentBoardId }) => boards[currentBoardId]));
  const columns = useKanbanStore((state) => state.columns);

  const moveColumn = useKanbanStore.use.moveColumn();
  const moveTask = useKanbanStore.use.moveTask();

  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 }, // 드래그 핸들에 있는 버튼 클릭 가능하도록 10px 이동했을때만 활성
  });

  const { dragColumnId, setDragState, dragTaskId, resetDragState } = useDragState();

  /**
   * 하이드레이션 에러 해결
   * @see https://github.com/clauderic/dnd-kit/issues/926
   * */
  const dndContextId = useId();

  const onDragStart = ({ active }: DragStartEvent) => {
    const dragType = getDragTypes(active).isActiveTask ? 'task' : 'column';
    setDragState(dragType, active.id);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    resetDragState(); // early return 있으므로 최상단에서 초기화 필요

    if (active.id === over?.id) return;

    const activeSortable = active.data.current?.sortable as Sortable;
    const overSortable = over?.data.current?.sortable as Sortable;
    if (!activeSortable || !overSortable) return;

    if (getDragTypes(active).isActiveColumn) {
      const newColumnIds = arrayMove(board.columnIds, activeSortable.index, overSortable.index);
      moveColumn(board.id, newColumnIds);
    }
  };

  const onDragOver = ({ active, over, delta, activatorEvent }: DragOverEvent) => {
    if (!over) return; // 드롭 영역 벗어났을 때
    if (active.id === over.id) return; // 같은 위치일 때

    const { isActiveTask, isOverTask, isOverColumn } = getDragTypes(active, over);

    if (!isActiveTask) return; // Task Card 드래그가 아닐 때

    const activeSort = active.data.current?.sortable as Sortable;
    const overSort = over.data.current?.sortable as Sortable;

    const sourceColumnId = activeSort.containerId;
    const targetColumnId = isOverTask ? overSort.containerId : toColumnId(over.id);

    const sourceTaskId = toTaskId(active.id);
    // 드롭 대상이 Task 카드일 때
    let sourceTaskIdx = activeSort.index;
    let targetTaskIdx = overSort.index;

    // 드롭 대상이 컬럼 영역일 때 (컬럼에 카드가 없거나 Task 카드가 아닌 다른 영역에 위치했을 때)
    if (isOverColumn) {
      const sourceColumn = columns[sourceColumnId];
      sourceTaskIdx = sourceColumn.taskIds.indexOf(sourceTaskId);

      const targetColumn = columns[targetColumnId];
      targetTaskIdx = targetColumn.taskIds.indexOf(sourceTaskId);

      if (targetTaskIdx === -1) {
        // delta: 드래그 시작 대비 이동거리, clientY: 드래그 시작 지점 좌표
        const currentY = (activatorEvent as MouseEvent).clientY + delta.y;
        // 대상 컬럼의 첫번째 카드보다 위로 드래그 했을 땐 첫번째로, 그 외엔 마지막으로(대상 컬럼의 마지막 카드보다 아래)
        targetTaskIdx = currentY < 200 ? 0 : targetColumn.taskIds.length;
      }
    }

    moveTask({ sourceTaskId, sourceColumnId, targetColumnId, sourceTaskIdx, targetTaskIdx });
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
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext items={board.columnIds} id={board.id}>
          {board.columnIds.map((columnId) => (
            <Column key={columnId} columnId={columnId} />
          ))}
        </SortableContext>
        <DragOverlay>
          {dragColumnId && <Column columnId={toColumnId(dragColumnId)} />}
          {dragTaskId && <TaskCard taskId={toTaskId(dragTaskId)} className="w-[272px]" />}
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
