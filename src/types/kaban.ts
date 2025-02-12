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

export interface Kanban {
  tasks: Record<TaskId, Task>;
  columns: Record<ColumnId, Column>;
  boards: Record<BoardId, Board>;
}
