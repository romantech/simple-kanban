import { z } from 'zod';

export const timestampsSchema = z.object({
  createdAt: z.string().datetime({ offset: true }), // UTC 오프셋 허용
  updatedAt: z.string().datetime({ offset: true }),
});

export const titleSchema = z
  .string()
  .trim()
  .min(1, { message: '최소 1글자 이상 입력해주세요' })
  .max(50, { message: '최대 50자까지만 입력할 수 있어요' });
