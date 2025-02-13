import {
  type Board,
  type BoardId,
  type Column,
  type ColumnId,
  type Task,
  type TaskId,
} from '@/lib';

export enum KanbanBrandType {
  Task = 'Task',
  Column = 'Column',
  Board = 'Board',
}

export type KanbanEntity = keyof typeof KanbanBrandType;

export type Tasks = Record<TaskId, Task>;
export type Columns = Record<ColumnId, Column>;
export type Boards = Record<BoardId, Board>;

export interface Kanban {
  tasks: Tasks;
  columns: Columns;
  boards: Boards;
}
