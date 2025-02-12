import { create } from 'zustand';
import type { Board, BoardId, Column, ColumnId, Kanban, Task } from '@/types';
import { initialBoardId, sampleKanbanData } from '@/lib';
import { createSelectors } from '@/store/create-selectors';

interface KanbanState extends Kanban {
  currentBoardId: BoardId;
}

interface KanbanActions {
  initialize: (data?: KanbanState) => void;
  getColumnWithTasks: (columnId: ColumnId) => { tasks: Task[]; column: Column };
  setBoard: (boardId: BoardId) => void;
  getBoard: () => Board;
}

const initialState: KanbanState = {
  ...sampleKanbanData,
  currentBoardId: initialBoardId,
};

const useKanbanStoreBase = create<KanbanActions & KanbanState>((set, get) => ({
  // 데이터
  ...initialState,

  // 조회
  getColumnWithTasks: (columnId) => {
    const { tasks, columns } = get();
    const column = columns[columnId];

    if (!column) throw new Error(`'${columnId}'에 해당하는 컬럼이 존재하지 않습니다.`);

    const tasksByColumnId = column.taskIds.map((id) => tasks[id]);
    return { tasks: tasksByColumnId, column };
  },
  getBoard: () => {
    const { boards, currentBoardId } = get();
    return boards[currentBoardId];
  },

  // 액션
  initialize: (data) => set(data ?? sampleKanbanData),
  setBoard: (boardId) => {
    const { boards } = get();
    if (!boards[boardId]) throw new Error(`'${boardId}'에 해당하는 보드가 존재하지 않습니다.`);

    set({ currentBoardId: boardId });
  },
}));

const useKanbanStore = createSelectors(useKanbanStoreBase);

export { useKanbanStoreBase, useKanbanStore };
