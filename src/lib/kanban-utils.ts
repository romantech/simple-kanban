import { z } from 'zod';
import { nanoid } from 'nanoid';
import { getISODate } from '@/lib/utils';
import {
  type BoardId,
  type ColumnFields,
  type ColumnId,
  KanbanBrandType,
  type KanbanEntity,
  type TaskFields,
  type TaskId,
  type TitleField,
} from '@/lib';
import type { Active, Over } from '@dnd-kit/core';
import type { Columns, TaskSortable } from '@/types';

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

export const computeTargetTaskIdx = (
  isOverColumn: boolean,
  targetColumn: Columns[ColumnId],
  overSort: TaskSortable,
  sourceTaskId: TaskId,
  deltaY: number,
  clientY: number,
  topOffset = 200,
): number => {
  // 드롭 대상이 Task 카드일 때
  if (!isOverColumn) return overSort.index;

  // 드롭 대상이 컬럼 영역일 때 (컬럼에 카드가 없거나 Task 카드가 아닌 다른 영역에 위치했을 때)
  const index = targetColumn.taskIds.indexOf(sourceTaskId);
  if (index !== -1) return index;

  // 드래그 시작 위치(clientY)와 이동량(deltaY)을 합산하여 대상 인덱스 결정
  const currentY = clientY + deltaY;
  // 대상 컬럼의 첫번째 카드보다 위로 드래그 했을 땐 첫번째로, 그 외엔 마지막으로(대상 컬럼의 마지막 카드보다 아래)
  return currentY < topOffset ? 0 : targetColumn.taskIds.length;
};
