import type { Columns, Void } from '@/types';
import { getISODate, sampleColumns } from '@/lib';
import { type KanbanSliceCreator } from '@/store';
import { type BoardId, type ColumnFields, type ColumnId, type TitleField } from '@/schema';

export interface ColumnSlice {
  columns: Columns;

  addColumn: Void<[ColumnFields]>;
  deleteColumn: Void<[ColumnFields]>;
  editColumn: Void<[ColumnId, TitleField]>;
  moveColumn: Void<[BoardId, ColumnId[]]>;
}

type ColumnSliceCreator = KanbanSliceCreator<ColumnSlice>;

export const createColumnSlice: ColumnSliceCreator = (set) => ({
  columns: sampleColumns,

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
});
