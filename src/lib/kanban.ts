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
