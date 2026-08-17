import { type z } from 'zod';
import type { UniqueIdentifier } from '@dnd-kit/core';

export const createBrandedParser =
  <Schema extends z.ZodType<string>>(schema: Schema) =>
  (value: UniqueIdentifier): z.output<Schema> => {
    return schema.parse(value);
  };

/**
 * @example Void<[string, number?]>
 * */
export type Void<T extends unknown[] = []> = (...param: T) => void;

export interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const isAPIResponse = (responseData: unknown): responseData is APIResponse => {
  if (!responseData || typeof responseData !== 'object') return false;
  return 'success' in responseData && 'message' in responseData;
};
