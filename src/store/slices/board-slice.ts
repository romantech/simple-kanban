import { type Boards, type Void } from '@/types';
import { getISODate, sampleBoardId, sampleBoards } from '@/lib';
import { type KanbanSliceCreator } from '@/store';
import { type BoardDef, type BoardId, type ColumnDef, type TitleDef } from '@/schema';

export interface BoardSlice {
  boards: Boards;
  currentBoardId: BoardId;

  addBoard: Void<[BoardDef, boolean]>;
  deleteBoard: (boardId: BoardId) => BoardDef;
  editBoard: Void<[BoardId, TitleDef]>;
  setCurrentBoard: Void<[BoardId]>;

  getBoardCount: () => number;
  getCurrentBoardColumns: () => ColumnDef[];
}

type BoardSliceCreator = KanbanSliceCreator<BoardSlice>;

export const createBoardSlice: BoardSliceCreator = (set, get) => ({
  boards: sampleBoards,
  currentBoardId: sampleBoardId,

  addBoard: (board, preset) => {
    set((state) => {
      state.boards[board.id] = board;
      state.currentBoardId = board.id;
      if (preset) state.addPreset(board.id);
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
    // 상태 변경 후 실행됨
    const { boards, currentBoardId } = get();
    return boards[currentBoardId];
  },
  editBoard: (boardId, title) => {
    set((state) => {
      const board = state.boards[boardId];
      board.title = title;
      board.updatedAt = getISODate();
    });
  },
  setCurrentBoard: (boardId) => {
    set((state) => {
      if (state.currentBoardId === boardId) return;
      state.currentBoardId = boardId;
    });
  },

  getBoardCount: () => Object.keys(get().boards).length,
  getCurrentBoardColumns: () => {
    const { boards, currentBoardId, columns } = get();
    const board = boards[currentBoardId];
    return board.columnIds.map((columnId) => columns[columnId]);
  },
});
