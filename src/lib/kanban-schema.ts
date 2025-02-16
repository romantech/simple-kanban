import { z } from 'zod';

export enum KanbanBrandType {
  Task = 'Task',
  Column = 'Column',
  Board = 'Board',
}

export type KanbanEntity = keyof typeof KanbanBrandType;
export const taskId = z.string().brand<KanbanBrandType.Task>();
export const columnId = z.string().brand<KanbanBrandType.Column>();
export const boardId = z.string().brand<KanbanBrandType.Board>();

const timestampsSchema = z.object({
  createdAt: z.string().datetime({ offset: true }), // UTC 오프셋 허용
  updatedAt: z.string().datetime({ offset: true }),
});

export const titleSchema = z
  .string()
  .trim()
  .min(1, { message: '최소 1글자 이상 입력해주세요' })
  .max(50, { message: '최대 50자까지만 입력할 수 있어요' });

export const taskSchema = timestampsSchema.extend({
  id: taskId,
  columnId: columnId,
  title: titleSchema,
  description: z
    .string()
    .max(500, { message: '설명은 최대 500자까지만 입력할 수 있어요' })
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
});

export const columnSchema = timestampsSchema.extend({
  id: columnId,
  boardId: boardId,
  title: titleSchema,
  taskIds: z.array(taskId),
});

export const boardSchema = timestampsSchema.extend({
  id: boardId,
  title: titleSchema,
  columnIds: z.array(columnId),
});

export type TaskId = z.infer<typeof taskId>;
export type ColumnId = z.infer<typeof columnId>;
export type BoardId = z.infer<typeof boardId>;

export type TaskFields = z.infer<typeof taskSchema>;
export type ColumnFields = z.infer<typeof columnSchema>;
export type BoardFields = z.infer<typeof boardSchema>;

export type TitleField = z.infer<typeof titleSchema>;

export const addTaskSchema = taskSchema.pick({ title: true, description: true });
export type AddTaskSchema = z.infer<typeof addTaskSchema>;
export const addColumnSchema = columnSchema.pick({ title: true });
export type AddColumnSchema = z.infer<typeof addColumnSchema>;

export const addBoardSchema = boardSchema.pick({ title: true });
export type AddBoardSchema = z.infer<typeof addBoardSchema>;
