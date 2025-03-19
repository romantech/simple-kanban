import { z } from 'zod';
import { createTitleSchema, timestampsSchema } from '@/schema/base';
import { BoardConfig, ColumnConfig, TaskConfig } from '@/lib/kanban-config';

export enum KanbanBrandType {
  Task = 'Task',
  Column = 'Column',
  Board = 'Board',
  Subtask = 'Subtask',
}

export type KanbanEntity = keyof typeof KanbanBrandType;

export const taskId = z.string().brand<KanbanBrandType.Task>();
export const subtaskId = z.string().brand<KanbanBrandType.Subtask>();
export const columnId = z.string().brand<KanbanBrandType.Column>();
export const boardId = z.string().brand<KanbanBrandType.Board>();

export const subtaskSchema = timestampsSchema.extend({
  id: subtaskId,
  taskId: taskId,
  title: createTitleSchema({
    max: TaskConfig.subtask.title.max,
    min: TaskConfig.subtask.title.min,
  }),
  completed: z.boolean().default(false),
  generatedByAI: z.boolean().default(false),
});

export const taskSchema = timestampsSchema.extend({
  id: taskId,
  columnId: columnId,
  title: createTitleSchema({ max: TaskConfig.title.max, min: TaskConfig.title.min }),
  description: z
    .string()
    .max(TaskConfig.desc.max, { message: `최대 ${TaskConfig.desc.max}자까지 입력할 수 있어요` })
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  subtaskIds: z.array(subtaskId).default([]),
});

export const columnSchema = timestampsSchema.extend({
  id: columnId,
  boardId: boardId,
  title: createTitleSchema({ max: ColumnConfig.title.max, min: ColumnConfig.title.min }),
  taskIds: z.array(taskId).default([]),
});

export const boardSchema = timestampsSchema.extend({
  id: boardId,
  title: createTitleSchema({ max: BoardConfig.title.max, min: BoardConfig.title.min }),
  columnIds: z.array(columnId).default([]),
});

export type TaskId = z.infer<typeof taskId>;
export type SubtaskId = z.infer<typeof subtaskId>;
export type ColumnId = z.infer<typeof columnId>;
export type BoardId = z.infer<typeof boardId>;

export type TaskDef = z.infer<typeof taskSchema>;
export type SubtaskDef = z.infer<typeof subtaskSchema>;
export type ColumnDef = z.infer<typeof columnSchema>;
export type BoardDef = z.infer<typeof boardSchema>;
export type TitleDef = z.infer<ReturnType<typeof createTitleSchema>>;

export const addTaskSchema = taskSchema.pick({ title: true, description: true }).extend({
  autoSubtasks: z.boolean().default(false),
});
export type AddTaskSchema = z.infer<typeof addTaskSchema>;

export const addColumnSchema = columnSchema.pick({ title: true });
export type AddColumnSchema = z.infer<typeof addColumnSchema>;

export const addBoardSchema = boardSchema
  .pick({ title: true })
  .extend({ preset: z.boolean().default(true) });
export type AddBoardSchema = z.infer<typeof addBoardSchema>;

export const subtaskRequestBodySchema = z.object({
  title: createTitleSchema(),
  description: z.string().optional(),
});

export const generateSubtaskScheme = z.object({
  subtasks: z.array(z.string().describe('Subtask title')),
});
