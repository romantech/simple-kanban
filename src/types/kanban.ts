import {
  type BoardFields,
  type BoardId,
  type ColumnFields,
  type ColumnId,
  type TaskFields,
  type TaskId,
} from '@/lib';

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
