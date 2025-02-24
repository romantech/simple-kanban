import { z } from 'zod';

export const timestampsSchema = z.object({
  createdAt: z.string().datetime({ offset: true }), // UTC 오프셋 허용
  updatedAt: z.string().datetime({ offset: true }),
});

export const createTitleSchema = ({ min = 1, max = 30 } = {}) => {
  return z
    .string()
    .trim()
    .min(min, { message: `최소 ${min}자 이상 입력해주세요` })
    .max(max, { message: `최대 ${max}자까지 입력할 수 있어요` });
};
