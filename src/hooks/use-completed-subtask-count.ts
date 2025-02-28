'use client';

import { type TaskId } from '@/schema';
import { useKanbanStore } from '@/store';

export const useCompletedSubtaskCount = (taskId: TaskId) => {
  return useKanbanStore((state) => {
    return state.tasks[taskId].subtaskIds.reduce(
      (total, id) => (state.subtasks[id].completed ? total + 1 : total),
      0,
    );
  });
};
