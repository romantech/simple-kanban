import { type Boards, type Void } from '@/types';
import {
  type BoardFields,
  type BoardId,
  generatePresetColumns,
  getISODate,
  sampleBoardId,
  sampleBoards,
  type TitleField,
} from '@/lib';
import { type KanbanSliceCreator } from '@/store';

export interface BoardSlice {
  boards: Boards;
  currentBoardId: BoardId;

  addBoard: Void<[BoardFields, boolean]>;
  editBoard: Void<[BoardId, TitleField]>;
  setCurrentBoard: Void<[BoardId]>;
  deleteBoard: Void<[BoardId]>;
  getBoardCount: () => number;
}

type BoardStateCreator = KanbanSliceCreator<BoardSlice>;

export const createBoardSlice: BoardStateCreator = (set, get) => ({
  boards: sampleBoards,
  currentBoardId: sampleBoardId,

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
});
