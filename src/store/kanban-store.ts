import { create } from 'zustand';

import {
  type BoardId,
  type Column,
  type ColumnId,
  generateId,
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

interface KanbanActions {
  initialize: (data?: KanbanState) => void;
  setBoard: (boardId: BoardId) => void;
  addTask: (columnId: ColumnId, title: Title) => void;
  addColumn: (title: Title) => void;
  deleteColumn: (columnId: ColumnId) => void;
  setColumnTitle: (columnId: ColumnId, title: Title) => void;
}

const initialState: KanbanState = {
  ...sampleKanbanData,
  currentBoardId: initialBoardId,
};

const useKanbanStoreBase = create<KanbanActions & KanbanState>()(
  immer((set, get) => ({
    // 데이터
    ...initialState,

    // 액션
    initialize: (data) => set(data ?? sampleKanbanData),
    setBoard: (boardId) => {
      const { boards } = get();
      if (!boards[boardId]) throw new Error(`'${boardId}'에 해당하는 보드가 존재하지 않습니다.`);

      set({ currentBoardId: boardId });
    },
    addTask: (columnId, title) => {
      const id: TaskId = generateId('Task');
      const now = getISODate();

      const newTask: Task = { id, title, createdAt: now, updatedAt: now };

      set((state) => {
        const column = state.columns[columnId];
        column.taskIds.push(id);
        state.tasks[id] = newTask;
      });
    },
    addColumn: (title) => {
      const id: ColumnId = generateId('Column');
      const now = getISODate();
      const newBoard: Column = { id, createdAt: now, title, taskIds: [] };

      set((state) => {
        state.columns[id] = newBoard;
        state.boards[state.currentBoardId].columnIds.push(id);
      });
    },
    deleteColumn: (columnId) => {
      set((state) => {
        const column = state.columns[columnId];
        const board = state.boards[state.currentBoardId];
        board.columnIds = board.columnIds.filter((id) => id !== columnId);
        column.taskIds.forEach((id) => delete state.tasks[id]);
        delete state.columns[columnId];
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
