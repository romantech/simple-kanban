import { z } from 'zod';
import { nanoid } from 'nanoid';
import { getISODate } from '@/lib/utils';
import type { Active, Over } from '@dnd-kit/core';
import type { TaskSortable } from '@/types';
import {
  type BoardFields,
  type BoardId,
  type ColumnFields,
  type ColumnId,
  KanbanBrandType,
  type KanbanEntity,
  type TaskFields,
  type TaskId,
  type TitleField,
} from '@/schema';

export const generateKanbanId = <T extends KanbanEntity>(entity: T) => {
  const brand = KanbanBrandType[entity];
  return z.string().brand(brand).parse(`${entity}-${nanoid()}`);
};

export const generateKanbanIds = <T extends KanbanEntity>(type: T, count: number) => {
  return Array.from({ length: count }, () => generateKanbanId(type));
};

export const generateTask = (
  columnId: ColumnId,
  title: TitleField,
  description?: string,
): TaskFields => {
  const now = getISODate();

  return {
    id: generateKanbanId('Task'),
    columnId,
    title,
    description,
    createdAt: now,
    updatedAt: now,
  };
};

export const generateColumn = (boardId: BoardId, title: TitleField): ColumnFields => {
  const now = getISODate();

  return {
    id: generateKanbanId('Column'),
    boardId,
    title,
    createdAt: now,
    updatedAt: now,
    taskIds: [],
  };
};

export const generatePresetColumns = (boardId: BoardId) => {
  const defaultTitles = ['진행 전', '진행 중', '완료'];
  return defaultTitles.map((title) => generateColumn(boardId, title));
};

export const generateBoard = (title: TitleField): BoardFields => {
  const now = getISODate();

  return {
    id: generateKanbanId('Board'),
    title,
    createdAt: now,
    updatedAt: now,
    columnIds: [],
  };
};

export const getDragTypes = (active: Active, over?: Over | null) => {
  const activeData = active.data.current;
  const overData = over?.data.current;

  if (!activeData) throw new Error('Drag data is missing for active or over element');

  return {
    /** 드래그한 요소가 Task 카드일 때   */
    isActiveTask: activeData.type === 'task',
    /** 드래그할 위치가 Task 카드일 때  */
    isOverTask: overData?.type === 'task',
    /** 드래그한 요소가 컬럼일 때 */
    isActiveColumn: activeData.type === 'column',
    /** 드래그할 위치가 컬럼일 때 */
    isOverColumn: overData?.type === 'column',
  };
};

interface ComputeTargetTaskIdxParams {
  /** 드롭 대상이 컬럼인지 여부 */
  isOverColumn: boolean;
  /** 드롭할 대상 컬럼 */
  targetColumn: ColumnFields;
  /** 드롭 대상 태스크의 정렬 정보 */
  overSort: TaskSortable;
  /** 드래그 중인 태스크의 ID */
  sourceTaskId: TaskId;
  /** 드래그 중인 태스크의 현재 Y 좌표 */
  currentY: number;
  /** 컬럼의 상단 경계 오프셋 */
  topThreshold?: number;
}
export const computeTargetTaskIdx = ({
  isOverColumn,
  targetColumn,
  overSort,
  sourceTaskId,
  currentY,
  topThreshold = 200,
}: ComputeTargetTaskIdxParams): number => {
  // 드롭 대상이 태스크일 때
  if (!isOverColumn) return overSort.index;

  // 드롭 대상이 컬럼 영역일 때 (컬럼에 카드가 없거나 태스크가 아닌 다른 영역에 위치했을 때)
  const index = targetColumn.taskIds.indexOf(sourceTaskId);
  // (드래그 중) 컬럼 영역 진입 → 아이템 목록 업데이트한 상태에서 다시 움직였을 때 (드롭 Placeholder 표시)
  if (index !== -1) return index;

  // 대상 컬럼의 첫번째 카드보다 위로 드래그 했을 땐 첫번째로, 그 외엔 마지막 인덱스로 설정
  return currentY < topThreshold ? 0 : targetColumn.taskIds.length;
};
