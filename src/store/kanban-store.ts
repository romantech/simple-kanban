import {
  type BoardSlice,
  type ColumnSlice,
  createBoardSlice,
  createColumnSlice,
  createTaskSlice,
  type TaskSlice,
} from '@/store/slices';
import { create, type StateCreator } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '@/store/helpers';

export type KanbanState = BoardSlice & ColumnSlice & TaskSlice;
export type KanbanStateUnion = BoardSlice | ColumnSlice | TaskSlice;

export type KanbanSliceCreator<T extends KanbanStateUnion> = StateCreator<
  BoardSlice & ColumnSlice & TaskSlice, // Kanban 보드의 전체 상태
  [
    ['zustand/subscribeWithSelector', never], // Zustand 미들웨어
    ['zustand/immer', never],
    ['zustand/persist', unknown],
    ['zustand/devtools', never],
  ],
  [],
  T // 개별 Slice 상태
>;

/**
 * @see https://zustand.docs.pmnd.rs/guides/slices-pattern Zustand Slice 패턴 가이드
 * @see https://zustand.docs.pmnd.rs/guides/typescript#slices-pattern Slice 패턴 TypeScript 가이드
 * */
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
