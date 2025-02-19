import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  arrayMove,
  type BoardFields,
  type BoardId,
  type ColumnFields,
  type ColumnId,
  generatePresetColumns,
  getISODate,
  type TaskFields,
  type TaskId,
  type TitleField,
} from '@/lib';
import { createSelectors } from '@/store/create-selectors';
import { type KanbanData, type MoveTaskPayload, type Void } from '@/types';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { initialBoardId, sampleKanbanData } from '@/lib/sample-kanban-data';

interface KanbanState extends KanbanData {
  currentBoardId: BoardId;
}

interface KanbanActions {
  initialize: Void<[KanbanState?]>;

  addBoard: Void<[BoardFields, boolean]>;
  editBoard: Void<[BoardId, TitleField]>;
  setCurrentBoard: Void<[BoardId]>;
  deleteBoard: Void<[BoardId]>;
  getBoardCount: () => number;

  addTask: Void<[TaskFields]>;
  deleteTask: Void<[TaskFields]>;
  editTask: Void<[TaskId, TitleField, string?]>;

  addColumn: Void<[ColumnFields]>;
  deleteColumn: Void<[ColumnFields]>;
  editColumn: Void<[ColumnId, TitleField]>;
  moveColumn: Void<[BoardId, ColumnId[]]>;
  moveTask: Void<[MoveTaskPayload]>;
}

const initialState: KanbanState = {
  ...sampleKanbanData,
  currentBoardId: initialBoardId,
};

const useKanbanStoreBase = create<KanbanActions & KanbanState>()(
  devtools(
    persist(
      immer(
        subscribeWithSelector((set, get) => ({
          // 데이터
          ...initialState,

          // 액션
          initialize: (data) => set(data ?? initialState),
          getBoardCount: () => Object.keys(get().boards).length,
          addBoard: (board, preset) => {
            set((state) => {
              state.boards[board.id] = board;
              state.currentBoardId = board.id;
              if (!preset) return;

              generatePresetColumns(board.id).forEach((column) => {
                state.columns[column.id] = column;
                board.columnIds.push(column.id);
              });
            });
          },
          editBoard: (boardId, title) => {
            set((state) => {
              const board = state.boards[boardId];
              board.title = title;
              board.updatedAt = getISODate();
            });
          },
          deleteBoard: (boardId) => {
            set((state) => {
              const beforeBoardIds = Object.keys(state.boards) as BoardId[];
              if (beforeBoardIds.length <= 1) return;

              const board = state.boards[boardId];
              board.columnIds.forEach((columnId) => {
                const column = state.columns[columnId];
                column.taskIds.forEach((taskId) => delete state.tasks[taskId]);
                delete state.columns[columnId];
              });

              // 삭제한 보드가 첫번째였다면 그 다음 보드 선택, 아니라면 이전 보드 선택
              const index = beforeBoardIds.indexOf(boardId);
              state.currentBoardId = index > 0 ? beforeBoardIds[index - 1] : beforeBoardIds[1];

              delete state.boards[boardId];
            });
          },
          setCurrentBoard: (boardId) => {
            set((state) => {
              if (state.currentBoardId === boardId) return;
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
          moveTask: (payload) => {
            set((state) => {
              const sourceColumn = state.columns[payload.sourceColumnId];
              const targetColumn = state.columns[payload.targetColumnId];

              // 동일 컬럼 안에서 드래그할 때
              if (payload.sourceColumnId === payload.targetColumnId) {
                sourceColumn.taskIds = arrayMove(
                  sourceColumn.taskIds,
                  payload.sourceTaskIdx,
                  payload.targetTaskIdx,
                );
              } else {
                // 다른 컬럼으로 드래그할 때
                sourceColumn.taskIds.splice(payload.sourceTaskIdx, 1);
                targetColumn.taskIds.splice(payload.targetTaskIdx, 0, payload.sourceTaskId);
                state.tasks[payload.sourceTaskId].columnId = payload.targetColumnId;
              }
            });
          },
        })),
      ),
      { name: 'kanban-storage' },
    ),
    {
      name: 'kanban-store',
    },
  ),
);

const useKanbanStore = createSelectors(useKanbanStoreBase);

export { useKanbanStore, type KanbanActions, type KanbanState };
