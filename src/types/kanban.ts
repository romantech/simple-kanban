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

export interface Sortable {
  index: number;
  containerId: ColumnId;
  items: TaskId[];
}

export interface MoveTaskPayload {
  sourceColumnId: ColumnId;
  targetColumnId: ColumnId;
  sourceTaskIdx: number;
  targetTaskIdx: number;
  sourceTaskId: TaskId;
}
