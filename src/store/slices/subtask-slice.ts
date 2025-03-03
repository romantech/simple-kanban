import type { Subtasks, Void } from '@/types';
import type { SubtaskDef, SubtaskId, TitleDef } from '@/schema';
import type { KanbanSliceCreator } from '@/store';
import { getISODate } from '@/lib';

export interface SubtaskSlice {
  subtasks: Subtasks;

  addSubtask: Void<[SubtaskDef]>;
  editSubtaskTitle: Void<[SubtaskId, TitleDef]>;
  editSubtaskStatus: Void<[SubtaskId, boolean]>;
  deleteSubtask: Void<[SubtaskId]>;
}

type SubTaskSliceCreator = KanbanSliceCreator<SubtaskSlice>;

export const createSubtaskSlice: SubTaskSliceCreator = (set, get) => ({
  subtasks: {},

  addSubtask: (subtask) => {
    set((state) => {
      const task = state.tasks[subtask.taskId];
      task.subtaskIds.unshift(subtask.id);
      state.subtasks[subtask.id] = subtask;
    });
  },
  editSubtaskTitle: (subtaskId, title) => {
    set((state) => {
      const subtask = state.subtasks[subtaskId];
      subtask.title = title;
      subtask.updatedAt = getISODate();
    });
  },
  editSubtaskStatus: (subtaskId, completed) => {
    set((state) => {
      const subtask = state.subtasks[subtaskId];
      subtask.completed = completed;
      subtask.updatedAt = getISODate();
    });
  },
  deleteSubtask: (subtaskId) => {
    set((state) => {
      const subtask = state.subtasks[subtaskId];
      const task = state.tasks[subtask.taskId];
      task.subtaskIds.splice(task.subtaskIds.indexOf(subtaskId), 1);
      delete state.subtasks[subtaskId];
    });
  },
});
