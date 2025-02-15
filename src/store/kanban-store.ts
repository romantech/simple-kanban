import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  type BoardId,
  type ColumnFields,
  type ColumnId,
  getISODate,
  initialBoardId,
  sampleKanbanData,
  type TaskFields,
  type TaskId,
  type TitleField,
} from '@/lib';
import { createSelectors } from '@/store/create-selectors';
import { type Kanban } from '@/types';
import { devtools, persist } from 'zustand/middleware';

interface KanbanState extends Kanban {
  currentBoardId: BoardId;
}

type ColumnAction = (column: ColumnFields) => void;
type TaskAction = (task: TaskFields) => void;

interface KanbanActions {
  initialize: (data?: KanbanState) => void;
  setBoard: (boardId: BoardId) => void;

  addTask: TaskAction;
  deleteTask: TaskAction;
  editTask: (taskId: TaskId, title: TitleField, description?: string) => void;

  addColumn: ColumnAction;
  deleteColumn: ColumnAction;
  editColumn: (columnId: ColumnId, title: TitleField) => void;
  moveColumn: (boardId: BoardId, columnIds: ColumnId[]) => void;
}

const initialState: KanbanState = {
  ...sampleKanbanData,
  currentBoardId: initialBoardId,
};

const useKanbanStoreBase = create<KanbanActions & KanbanState>()(
  devtools(
    persist(
      immer((set) => ({
        // 데이터
        ...initialState,

        // 액션
        initialize: (data) => set(data ?? initialState),
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
            column.taskIds.splice(column.taskIds.indexOf(task.id), 1);

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
            board.columnIds.splice(board.columnIds.indexOf(column.id), 1);
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
        moveColumn: (boardId, columnIds) => {
          set((state) => {
            const board = state.boards[boardId];
            board.columnIds = columnIds;
          });
        },
      })),
      { name: 'kanban-storage' },
    ),
    { name: 'kanban-store' },
  ),
);

const useKanbanStore = createSelectors(useKanbanStoreBase);

export { useKanbanStore };
