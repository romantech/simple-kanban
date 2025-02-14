import { KanbanBrandType, type KanbanEntity } from '@/types';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { getISODate } from '@/lib/utils';
import { type BoardId, type ColumnId, type Title } from '@/lib/schema';

export const generateKanbanId = <T extends KanbanEntity>(entity: T) => {
  const brand = KanbanBrandType[entity];
  return z.string().brand(brand).parse(`${entity}-${nanoid()}`);
};

export const generateKanbanIds = <T extends KanbanEntity>(type: T, count: number) => {
  return Array.from({ length: count }, () => generateKanbanId(type));
};

export const generateTask = (columnId: ColumnId, title: Title, description?: string) => {
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

export const generateColumn = (boardId: BoardId, title: Title) => {
  const now = getISODate();

  return {
    id: generateKanbanId('Column'),
    boardId,
    title,
    createdAt: now,
    taskIds: [],
  };
};
