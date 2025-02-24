import { z } from 'zod';
import { createTitleSchema, timestampsSchema } from '@/schema/base';
import { BoardConfig, ColumnConfig, TaskConfig } from '@/lib/kanban-config';

export enum KanbanBrandType {
  Task = 'Task',
  Column = 'Column',
  Board = 'Board',
}

export type KanbanEntity = keyof typeof KanbanBrandType;

export const taskId = z.string().brand<KanbanBrandType.Task>();
export const columnId = z.string().brand<KanbanBrandType.Column>();
export const boardId = z.string().brand<KanbanBrandType.Board>();

export const taskSchema = timestampsSchema.extend({
  id: taskId,
  columnId: columnId,
  title: createTitleSchema({ max: TaskConfig.title.max, min: TaskConfig.title.min }),
  description: z
    .string()
    .max(TaskConfig.desc.max, { message: `최대 ${TaskConfig.desc.max}자까지 입력할 수 있어요` })
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
});

export const columnSchema = timestampsSchema.extend({
  id: columnId,
  boardId: boardId,
  title: createTitleSchema({ max: ColumnConfig.title.max, min: ColumnConfig.title.min }),
  taskIds: z.array(taskId),
});

export const boardSchema = timestampsSchema.extend({
  id: boardId,
  title: createTitleSchema({ max: BoardConfig.title.max, min: BoardConfig.title.min }),
  columnIds: z.array(columnId),
});

export type TaskId = z.infer<typeof taskId>;
export type ColumnId = z.infer<typeof columnId>;
export type BoardId = z.infer<typeof boardId>;
export type TaskFields = z.infer<typeof taskSchema>;
export type ColumnFields = z.infer<typeof columnSchema>;
export type BoardFields = z.infer<typeof boardSchema>;
export type TitleField = z.infer<ReturnType<typeof createTitleSchema>>;

export const addTaskSchema = taskSchema.pick({ title: true, description: true });
export type AddTaskSchema = z.infer<typeof addTaskSchema>;

export const addColumnSchema = columnSchema.pick({ title: true });
export type AddColumnSchema = z.infer<typeof addColumnSchema>;

export const addBoardSchema = boardSchema
  .pick({ title: true })
  .extend({ preset: z.boolean().default(true) });
export type AddBoardSchema = z.infer<typeof addBoardSchema>;
