import { type TaskDef, type TaskId, type TitleDef } from '@/schema';
import { type MoveTaskPayload, type Tasks, type Void } from '@/types';
import { type KanbanSliceCreator } from '@/store';
import { arrayMove, getCurrentISODate, sampleTasks } from '@/lib';

export interface TaskSlice {
  tasks: Tasks;

  addTask: Void<[TaskDef]>;
  deleteTask: Void<[TaskDef]>;
  editTask: Void<[TaskId, TitleDef, string?]>;
  clearAIGeneratedSubtasks: Void<[TaskId]>;

  moveTask: Void<[MoveTaskPayload]>;
}

type TaskSliceCreator = KanbanSliceCreator<TaskSlice>;

export const createTaskSlice: TaskSliceCreator = (set) => ({
  tasks: sampleTasks,
  subtasks: {},

  addTask: (task) => {
    set((state) => {
      const column = state.columns[task.columnId];
      column.taskIds.unshift(task.id);
      state.tasks[task.id] = task;
    });
  },
  deleteTask: (task) => {
    set((state) => {
      const column = state.columns[task.columnId];
      column.taskIds.splice(column.taskIds.indexOf(task.id), 1);

      delete state.tasks[task.id];
    });
  },
  editTask: (taskId, title, description) => {
    set((state) => {
      const task = state.tasks[taskId];
      task.title = title;
      task.description = description;
      task.updatedAt = getCurrentISODate();
    });
  },
  clearAIGeneratedSubtasks: (taskId) => {
    set((state) => {
      const task = state.tasks[taskId];
      task.subtaskIds = task.subtaskIds.filter((subtaskId) => {
        if (!state.subtasks[subtaskId].generatedByAI) return true;

        delete state.subtasks[subtaskId];
        return false;
      });
    });
  },

  moveTask: (payload) => {
    set((state) => {
      const sourceColumn = state.columns[payload.sourceColumnId];
      const targetColumn = state.columns[payload.targetColumnId];

      // 동일 컬럼 안에서 드래그할 때
      if (payload.sourceColumnId === payload.targetColumnId) {
        sourceColumn.taskIds = arrayMove(
          sourceColumn.taskIds,
          payload.sourceTaskIdx,
          payload.targetTaskIdx,
        );
      } else {
        // 다른 컬럼으로 드래그할 때
        sourceColumn.taskIds.splice(payload.sourceTaskIdx, 1);
        targetColumn.taskIds.splice(payload.targetTaskIdx, 0, payload.sourceTaskId);
        state.tasks[payload.sourceTaskId].columnId = payload.targetColumnId;
      }
    });
  },
});
