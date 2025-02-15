import {
  type BoardFields,
  boardId,
  type BoardId,
  type ColumnFields,
  columnId,
  type ColumnId,
  type TaskFields,
  taskId,
  type TaskId,
} from '@/lib';
import { createBrandedParser } from '@/types/common';

export enum KanbanBrandType {
  Task = 'Task',
  Column = 'Column',
  Board = 'Board',
}

export type KanbanEntity = keyof typeof KanbanBrandType;

export type Tasks = Record<TaskId, TaskFields>;
export type Columns = Record<ColumnId, ColumnFields>;
export type Boards = Record<BoardId, BoardFields>;

export interface Kanban {
  tasks: Tasks;
  columns: Columns;
  boards: Boards;
}

export const toTaskId = createBrandedParser(taskId);
export const toColumnId = createBrandedParser(columnId);
export const toBoardId = createBrandedParser(boardId);
