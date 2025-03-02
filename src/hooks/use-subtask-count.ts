'use client';

import { type TaskId } from '@/schema';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

export const useSubtaskCount = (taskId: TaskId) => {
  return useKanbanStore(
    // useShallow: 셀렉터 반환값의 얕은 비교(1-depth 프로퍼티 비교) 수행
    // 객체/배열 반환 시 내부 프로퍼티 변경을 감지하여 불필요한 리렌더링 방지
    // 단일 원시 타입 값은 기본 Object.is 비교로 충분하므로 useShallow 불필요

    // 아래 셀렉터는 렌더링마다 새로운 객체를 반환하므로 프로퍼티 값이 같더라도 매번 변경된 것으로 인식됨
    // 때문에 useShallow 훅을 사용하여 객체 속성들을 얕게 비교하여 불필요한 렌더링 및 무한 렌더링 방지
    useShallow((state) => {
      const completed = state.tasks[taskId].subtaskIds.reduce(
        (total, id) => (state.subtasks[id].completed ? total + 1 : total),
        0,
      );
      const total = state.tasks[taskId].subtaskIds.length;
      const label = total > 0 ? `${completed}/${total}` : '0';
      return { label, completed, total };
    }),
  );
};
