import { z } from 'zod';
import { type KanbanBrandType } from '@/types';

const taskId = z.string().brand<KanbanBrandType.Task>();
const columnId = z.string().brand<KanbanBrandType.Column>();
const boardId = z.string().brand<KanbanBrandType.Board>();

export const titleSchema = z
  .string()
  .trim()
  .min(1, { message: '최소 1글자 이상 입력해주세요' })
  .max(20, { message: '최대 20자까지만 입력할 수 있어요' });

export const taskSchema = z.object({
  id: taskId,
  title: titleSchema,
  description: z.string().optional(),
  createdAt: z.coerce.string(),
  updatedAt: z.coerce.string(),
});

export const addTaskSchema = taskSchema.pick({
  title: true,
  description: true,
});

export const columnSchema = z.object({
  id: columnId,
  title: titleSchema,
  createdAt: z.coerce.string(),
  taskIds: z.array(taskId),
});

export const boardSchema = z.object({
  id: boardId,
  title: titleSchema,
  createdAt: z.coerce.string(),
  columnIds: z.array(columnId),
});

export type TaskId = z.infer<typeof taskId>;
export type ColumnId = z.infer<typeof columnId>;
export type BoardId = z.infer<typeof boardId>;

export type Task = z.infer<typeof taskSchema>;
export type Column = z.infer<typeof columnSchema>;
export type Board = z.infer<typeof boardSchema>;

export type Title = z.infer<typeof titleSchema>;

export const addColumnSchema = columnSchema.pick({ title: true });
export type AddColumnSchema = z.infer<typeof addColumnSchema>;
