import { type Branded } from '@/types/common';

export type KanbanEntity = 'task' | 'column' | 'board';

export type TaskId = Branded<`task-${string}`, 'task'>;
export type ColumnId = Branded<`column-${string}`, 'column'>;
export type BoardId = Branded<`board-${string}`, 'board'>;

export interface Task {
  id: TaskId;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  createdAt: string;
  taskIds: TaskId[];
}

export interface Board {
  id: BoardId;
  title: string;
  columnIds: ColumnId[];
}

export type Tasks = Record<TaskId, Task>;
export type Columns = Record<ColumnId, Column>;
export type Boards = Record<BoardId, Board>;

export interface Kanban {
  tasks: Tasks;
  columns: Columns;
  boards: Boards;
}
