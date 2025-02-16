'use client';

import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
} from '@dnd-kit/core';
import { useDragState } from '@/hooks/use-drag-state';
import { useId } from 'react';
import { computeTargetTaskIdx, getDragTypes } from '@/lib';
import { type ColumnSortable, type TaskSortable, toColumnId, toTaskId } from '@/types';
import { arrayMove } from '@dnd-kit/sortable';
import { useKanbanStore } from '@/store';
import { useDebouncedCallback } from 'use-debounce';

const useKanbanDnd = () => {
  const columns = useKanbanStore((state) => state.columns);
  const moveColumn = useKanbanStore.use.moveColumn();
  const moveTask = useKanbanStore.use.moveTask();

  /**
   * dnd-kit Sortable 사용 시 발생할 수 있는 Maximum update depth exceeded 이슈 해결
   * @see https://github.com/clauderic/dnd-kit/issues/900
   * */
  const debouncedMoveTask = useDebouncedCallback(moveTask, 0);

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

  /** 컬럼 이동 */
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    resetDragState(); // early return 있으므로 최상단에서 초기화 필요

    if (active.id === over?.id) return;

    const activeSort = active.data.current?.sortable as ColumnSortable;
    const overSort = over?.data.current?.sortable as ColumnSortable;
    if (!activeSort || !overSort) return;

    if (getDragTypes(active).isActiveColumn) {
      const newColumnIds = arrayMove(activeSort.items, activeSort.index, overSort.index);
      moveColumn(activeSort.containerId, newColumnIds);
    }
  };

  /** Task 카드 이동 */
  const onDragOver = ({ active, over, delta, activatorEvent }: DragOverEvent) => {
    if (!over) return; // 드롭 영역 벗어났을 때
    if (active.id === over.id) return; // 같은 위치일 때

    const { isActiveTask, isOverTask, isOverColumn } = getDragTypes(active, over);

    if (!isActiveTask) return; // Task Card 드래그가 아니라면 무시

    const activeSort = active.data.current?.sortable as TaskSortable;
    const overSort = over.data.current?.sortable as TaskSortable;

    const sourceTaskId = toTaskId(active.id);
    const sourceColumnId = activeSort.containerId;
    // 드롭 영역이 Task 카드이면 해당 카드의 컨테이너는 컬럼이므로 overSort.containerId 에서 ID 획득
    // 드롭 영역이 컬럼이면 over 는 컬럼을 가리키므로 over.id 에서 ID 획득
    const targetColumnId = isOverTask ? overSort.containerId : toColumnId(over.id);

    const targetColumn = columns[targetColumnId];

    const sourceTaskIdx = activeSort.index; // 드래그를 시작한 카드의 인덱스
    const clientY = (activatorEvent as MouseEvent).clientY;

    // 드롭 대상 카드의 인덱스
    const targetTaskIdx = computeTargetTaskIdx(
      isOverColumn,
      targetColumn,
      overSort,
      sourceTaskId,
      delta.y,
      clientY,
    );

    debouncedMoveTask({
      sourceTaskId,
      sourceColumnId,
      targetColumnId,
      sourceTaskIdx,
      targetTaskIdx,
    });
  };

  return {
    dndContextId,
    dragColumnId,
    dragTaskId,
    handlers: { onDragStart, onDragEnd, onDragOver },
    sensors: [mouseSensor],
  };
};

export { useKanbanDnd };
