import { createBrandedParser } from '@/types/common';
import {
  type BoardDef,
  type BoardId,
  type ColumnDef,
  columnId,
  type ColumnId,
  type SubtaskDef,
  type SubtaskId,
  type TaskDef,
  taskId,
  type TaskId,
} from '@/schema';

export type Tasks = Record<TaskId, TaskDef>;
export type Subtasks = Record<SubtaskId, SubtaskDef>;
export type Columns = Record<ColumnId, ColumnDef>;
export type Boards = Record<BoardId, BoardDef>;

export const toTaskId = createBrandedParser(taskId);
export const toColumnId = createBrandedParser(columnId);

export interface Sortable<TContainer, TItem> {
  index: number;
  containerId: TContainer;
  items: TItem[];
}

export type ColumnSortable = Sortable<BoardId, ColumnId>;
export type TaskSortable = Sortable<ColumnId, TaskId>;

export interface MoveTaskPayload {
  sourceColumnId: ColumnId;
  targetColumnId: ColumnId;
  sourceTaskIdx: number;
  targetTaskIdx: number;
  sourceTaskId: TaskId;
}
