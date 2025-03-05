'use client';

import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDragIds } from '@/hooks/kanban/use-drag-ids';
import { useId } from 'react';
import {
  computeTargetTaskIdx,
  getActiveDragType,
  moveSortableItems,
  resolveDragTypes,
} from '@/lib';
import {
  type ColumnSortable,
  type SubtaskSortable,
  type TaskSortable,
  toColumnId,
  toTaskId,
} from '@/types';
import { useKanbanStore } from '@/store';
import { useDebounceCallback } from 'usehooks-ts';
import { type BoardId, type ColumnId, type SubtaskId, type TaskId } from '@/schema';

const useKanbanDnd = () => {
  const columns = useKanbanStore((state) => state.columns);
  const moveColumn = useKanbanStore.use.moveColumn();
  const moveTask = useKanbanStore.use.moveTask();
  const moveSubtask = useKanbanStore.use.moveSubtask();

  /**
   * dnd-kit Sortable 사용 시 발생할 수 있는 Maximum update depth exceeded 이슈 해결
   * @see https://github.com/clauderic/dnd-kit/issues/900
   * */
  const debouncedMoveTask = useDebounceCallback(moveTask, 100);

  const { setDragIds, dragIds, resetDragIds } = useDragIds();

  /**
   * 하이드레이션 에러 해결
   * @see https://github.com/clauderic/dnd-kit/issues/926
   * */
  const dndContextId = useId();

  const onDragStart = ({ active }: DragStartEvent) => {
    const { isActiveSubtask, isActiveColumn, isActiveTask } = resolveDragTypes(active);
    const dragType = getActiveDragType({ isActiveSubtask, isActiveTask, isActiveColumn });

    setDragIds(dragType, active.id);
  };

  /** 컬럼 이동 */
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    // 드래그 중인 아이템이 DragOverlay에서 렌더링 되지 않도록 dragColumnId, dragTaskId 초기화
    // 하단에 early return 있으므로 최상단에서 초기화
    resetDragIds();

    if (!over) return; // 드롭 영역 벗어났을 때
    if (active.id === over.id) return; // 같은 위치는 스킵

    const { isActiveColumn, isActiveSubtask, isOverColumn, isOverSubtask } = resolveDragTypes(
      active,
      over,
    );

    if (isActiveSubtask && isOverSubtask) {
      moveSortableItems<TaskId, SubtaskId>({
        activeSort: active.data.current?.sortable as SubtaskSortable,
        overSort: over.data.current?.sortable as SubtaskSortable,
        updater: moveSubtask,
      });
    } else if (isActiveColumn && isOverColumn) {
      moveSortableItems<BoardId, ColumnId>({
        activeSort: active.data.current?.sortable as ColumnSortable,
        overSort: over.data.current?.sortable as ColumnSortable,
        updater: moveColumn,
      });
    }
  };

  /** Task 카드 이동 */
  const onDragOver = ({ active, over, delta, activatorEvent }: DragOverEvent) => {
    if (!over) return; // 드롭 영역 벗어났을 때
    if (active.id === over.id) return; // 같은 위치는 스킵

    const { isActiveTask, isOverTask, isOverColumn } = resolveDragTypes(active, over);

    if (!isActiveTask) return; // Task 드래그가 아니면 스킵

    const activeSort = active.data.current?.sortable as TaskSortable;
    const overSort = over.data.current?.sortable as TaskSortable;

    const sourceTaskId = toTaskId(active.id);
    const sourceTaskIdx = activeSort.index; // 드래그를 시작한 카드의 인덱스

    const sourceColumnId = activeSort.containerId;
    // 드롭 영역이 Task 카드이면 해당 카드의 컨테이너는 컬럼이므로 overSort.containerId 에서 ID 획득
    // 드롭 영역이 컬럼이면 over 자체는 컬럼을 참조하므로 over.id 에서 ID 획득
    const targetColumnId = isOverTask ? overSort.containerId : toColumnId(over.id);
    const targetColumn = columns[targetColumnId];

    // 드래그 시작 위치(clientY)와 이동 거리(delta.y)를 합산해서 현재 Y 위치 계산
    const currentY = (activatorEvent as MouseEvent).clientY + delta.y;

    // 드롭 대상 카드의 인덱스
    const targetTaskIdx = computeTargetTaskIdx({
      isOverColumn,
      targetColumn,
      overSort,
      sourceTaskId,
      currentY,
    });

    debouncedMoveTask({
      sourceTaskId,
      sourceColumnId,
      targetColumnId,
      sourceTaskIdx,
      targetTaskIdx,
    });
  };

  // 데스크톱 최적화
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      // 드래그 시작을 위해 요소 클릭 후 커서를 이동시켜야 하는 최소 거리(px)
      distance: 10, // 클릭 후 10px 이상 움직여야 드래그 시작 (의도치 않은 클릭 방지)
    },
  });

  // 모바일 최적화
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      // 드래그 시작을 위해 터치를 유지해야 하는 최소 시간(ms)
      delay: 250, // 250ms 터치 유지 필요 (일반적인 모바일 앱의 롱프레스 대기 시간)
      // delay 동안 허용되는 최대 이동 거리(px). 초과시 드래그 취소됨.
      tolerance: 5, // 5px 이내 움직임 허용 (손떨림이나 미세한 움직임 허용)
    },
  });

  const sensors = useSensors(touchSensor, mouseSensor);

  return {
    dndContextId,
    dragIds,
    sensors,
    handlers: { onDragStart, onDragEnd, onDragOver },
  };
};

export { useKanbanDnd };
