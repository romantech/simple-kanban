import { create } from 'zustand';
import type { BoardId, ColumnId, Kanban, Task, TaskId } from '@/types';
import { initialBoardId, sampleKanbanData } from '@/lib';
import { createSelectors } from '@/store/create-selectors';
import { nanoid } from 'nanoid';
import { immer } from 'zustand/middleware/immer';

interface KanbanState extends Kanban {
  currentBoardId: BoardId;
}

interface KanbanActions {
  initialize: (data?: KanbanState) => void;
  setBoard: (boardId: BoardId) => void;
  addTask: (columnId: ColumnId, title: Task['title']) => void;
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
      const id: TaskId = `task-${nanoid()}`;
      const now = new Date().toISOString();

      const newTask: Task = { id, title, createdAt: now, updatedAt: now };

      set((state) => {
        const column = state.columns[columnId];
        column.taskIds.push(id);
        state.tasks[id] = newTask;
      });
    },
  })),
);

const useKanbanStore = createSelectors(useKanbanStoreBase);

export { useKanbanStore };
