import { create } from 'zustand';
import type { Board, Column, ColumnId, Kanban as KanbanState, Task } from '@/types';
import { sampleKanbanData } from '@/lib';
import { createSelectors } from '@/store/create-selectors';

interface KanbanActions {
  initialize: (data?: KanbanState) => void;
  getColumnWithTasks: (columnId: ColumnId) => { tasks: Task[]; column: Column };
  getBoardTitles: () => Board['title'][];
}

const useKanbanStoreBase = create<KanbanActions & KanbanState>((set, get) => ({
  // 데이터
  ...sampleKanbanData,

  // 액션
  initialize: (data) => set(data ?? sampleKanbanData),
  getColumnWithTasks: (columnId) => {
    const { tasks, columns } = get();
    const column = columns[columnId];

    if (!column) throw new Error(`columnId '${columnId}'에 해당하는 컬럼이 존재하지 않습니다.`);

    const tasksByColumnId = column.taskIds.map((id) => tasks[id]);
    return { tasks: tasksByColumnId, column };
  },
  getBoardTitles: () => {
    const { boards } = get();
    return Object.values(boards).map((b) => b.title);
  },
}));

const useKanbanStore = createSelectors(useKanbanStoreBase);

export { useKanbanStoreBase, useKanbanStore };
