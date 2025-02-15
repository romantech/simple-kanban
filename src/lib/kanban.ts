import { KanbanBrandType, type KanbanEntity } from '@/types';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { getISODate } from '@/lib/utils';
import {
  type BoardId,
  type ColumnFields,
  type ColumnId,
  type TaskFields,
  type TitleField,
} from '@/lib/schema';
import type { Active, Over } from '@dnd-kit/core';

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

export const getDragTypes = (active: Active, over?: Over) => {
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
