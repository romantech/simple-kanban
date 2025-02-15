import { type z } from 'zod';
import type { UniqueIdentifier } from '@dnd-kit/core';

type BrandTag = string | number | symbol;
type BrandedId<T extends BrandTag> = z.infer<z.ZodBranded<z.ZodString, T>>;

export const createBrandedParser =
  <T extends BrandTag>(schema: z.ZodBranded<z.ZodString, T>) =>
  (value: UniqueIdentifier): BrandedId<T> => {
    return schema.parse(value);
  };
