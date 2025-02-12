type TaskId = string;
type ColumnId = string;
type BoardId = string;

export interface Task {
  id: TaskId;
  title: string;
  description?: string;
  createdAt: string;
  UpdatedAt: string;
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
