import { create } from 'zustand';

import {
  type BoardId,
  type Column,
  type ColumnId,
  initialBoardId,
  sampleKanbanData,
  type Task,
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
  addColumn: ColumnAction;
  deleteColumn: ColumnAction;
  setColumnTitle: (columnId: ColumnId, title: Title) => void;
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
    setColumnTitle: (columnId, title) => {
      set((state) => {
        const column = state.columns[columnId];
        column.title = title;
      });
    },
  })),
);

const useKanbanStore = createSelectors(useKanbanStoreBase);

export { useKanbanStore };
