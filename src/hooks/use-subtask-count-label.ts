'use client';

import { type TaskId } from '@/schema';
import { useKanbanStore } from '@/store';

export const useSubtaskCountLabel = (taskId: TaskId) => {
  return useKanbanStore((state) => {
    const subtaskCount = state.tasks[taskId].subtaskIds.reduce(
      (total, id) => (state.subtasks[id].completed ? total + 1 : total),
      0,
    );
    const totalSubtask = state.tasks[taskId].subtaskIds.length;
    return totalSubtask > 0 ? `${subtaskCount}/${totalSubtask}` : '0';
  });
};
