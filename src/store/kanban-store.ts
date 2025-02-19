import {
  type BoardSlice,
  type ColumnSlice,
  createBoardSlice,
  createColumnSlice,
  createTaskSlice,
  type TaskSlice,
} from '@/store/kanban-slices';
import { create, type StateCreator } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '@/store/helpers';

export type KanbanState = BoardSlice & ColumnSlice & TaskSlice;
export type KanbanStateUnion = BoardSlice | ColumnSlice | TaskSlice;

export type KanbanSliceCreator<T extends KanbanStateUnion> = StateCreator<
  // 전체 State
  BoardSlice & ColumnSlice & TaskSlice,
  // 미들웨어
  [
    ['zustand/subscribeWithSelector', never],
    ['zustand/immer', never],
    ['zustand/persist', unknown],
    ['zustand/devtools', never],
  ],
  [],
  // Slice 상태
  T
>;

const useKanbanStoreBase = create<KanbanState>()(
  subscribeWithSelector(
    immer(
      persist(
        devtools(
          (...methods) => ({
            ...createBoardSlice(...methods),
            ...createColumnSlice(...methods),
            ...createTaskSlice(...methods),
          }),
          { name: 'kanban-store' },
        ),
        { name: 'kanban-storage' },
      ),
    ),
  ),
);

export const useKanbanStore = createSelectors(useKanbanStoreBase);
