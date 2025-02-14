import { create } from 'zustand';

import {
  type BoardId,
  type Column,
  type ColumnId,
  getISODate,
  initialBoardId,
  sampleKanbanData,
  type Task,
  type TaskId,
  type Title,
} from '@/lib';
import { createSelectors } from '@/store/create-selectors';
import { immer } from 'zustand/middleware/immer';
import { type Kanban } from '@/types';

interface KanbanState extends Kanban {
  currentBoardId: BoardId;
}

type ColumnAction = (column: Column) => void;
type TaskAction = (task: Task) => void;

interface KanbanActions {
  initialize: (data?: KanbanState) => void;
  setBoard: (boardId: BoardId) => void;

  addTask: TaskAction;
  deleteTask: TaskAction;
  editTask: (taskId: TaskId, title: Title, description?: string) => void;

  addColumn: ColumnAction;
  deleteColumn: ColumnAction;
  editColumn: (columnId: ColumnId, title: Title) => void;

  editColumnOrder: (boardId: BoardId, columnIds: ColumnId[]) => void;
}

const initialState: KanbanState = {
  ...sampleKanbanData,
  currentBoardId: initialBoardId,
};

const useKanbanStoreBase = create<KanbanActions & KanbanState>()(
  immer((set) => ({
    // 데이터
    ...initialState,

    // 액션
    initialize: (data) => set(data ?? sampleKanbanData),
    setBoard: (boardId) => {
      set((state) => {
        state.currentBoardId = boardId;
      });
    },
    addTask: (task) => {
      set((state) => {
        const column = state.columns[task.columnId];
        column.taskIds.unshift(task.id);
        state.tasks[task.id] = task;
      });
    },
    deleteTask: (task) => {
      set((state) => {
        const column = state.columns[task.columnId];
        column.taskIds = column.taskIds.filter((id) => id !== task.id);
        delete state.tasks[task.id];
      });
    },
    editTask: (taskId, title, description) => {
      set((state) => {
        const task = state.tasks[taskId];
        task.title = title;
        task.description = description;
        task.updatedAt = getISODate();
      });
    },

    addColumn: (column) => {
      set((state) => {
        const board = state.boards[state.currentBoardId];
        board.columnIds.push(column.id);
        state.columns[column.id] = column;
      });
    },
    deleteColumn: (column) => {
      set((state) => {
        const board = state.boards[column.boardId];
        board.columnIds = board.columnIds.filter((id) => id !== column.id);
        column.taskIds.forEach((id) => delete state.tasks[id]);
        delete state.columns[column.id];
      });
    },
    editColumn: (columnId, title) => {
      set((state) => {
        const column = state.columns[columnId];
        column.title = title;
        column.updatedAt = getISODate();
      });
    },
    editColumnOrder: (boardId, columnIds) => {
      set((state) => {
        const board = state.boards[boardId];
        board.columnIds = columnIds;
      });
    },
  })),
);

const useKanbanStore = createSelectors(useKanbanStoreBase);

export { useKanbanStore };
