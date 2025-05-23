import type { Subtasks, Void } from '@/types';
import type { SubtaskDef, SubtaskId, TaskId, TitleDef } from '@/schema';
import type { KanbanSliceCreator } from '@/store';
import { getCurrentISODate, sampleSubtasks } from '@/lib';

export interface SubtaskSlice {
  subtasks: Subtasks;

  addSubtask: Void<[SubtaskDef, boolean?]>;
  editSubtaskTitle: Void<[SubtaskId, TitleDef]>;
  editSubtaskStatus: Void<[SubtaskId, boolean]>;
  deleteSubtask: Void<[SubtaskId]>;

  moveSubtask: Void<[TaskId, SubtaskId[]]>;
}

type SubTaskSliceCreator = KanbanSliceCreator<SubtaskSlice>;

export const createSubtaskSlice: SubTaskSliceCreator = (set) => ({
  subtasks: sampleSubtasks,

  addSubtask: (subtask, prepend = true) => {
    set((state) => {
      const task = state.tasks[subtask.taskId];
      const insertionAction = prepend ? 'unshift' : 'push';
      task.subtaskIds[insertionAction](subtask.id);
      state.subtasks[subtask.id] = subtask;
    });
  },
  editSubtaskTitle: (subtaskId, title) => {
    set((state) => {
      const subtask = state.subtasks[subtaskId];
      subtask.title = title;
      subtask.updatedAt = getCurrentISODate();
    });
  },
  editSubtaskStatus: (subtaskId, completed) => {
    set((state) => {
      const subtask = state.subtasks[subtaskId];
      subtask.completed = completed;
      subtask.updatedAt = getCurrentISODate();
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

  moveSubtask: (taskId, subtaskIds) => {
    set((state) => {
      const task = state.tasks[taskId];
      task.subtaskIds = subtaskIds;
    });
  },
});
