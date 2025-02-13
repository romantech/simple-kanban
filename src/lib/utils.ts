import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import { type Branded, type KanbanEntity } from '@/types';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const generateId = <T extends KanbanEntity>(type: T) => {
  return `${type}-${nanoid(10)}` as Branded<`${T}-${string}`, T>;
};

export const generateIds = <T extends KanbanEntity>(type: T, count: number) => {
  return Array.from({ length: count }, () => generateId(type));
};

export const getISODate = () => {
  return new Date().toISOString();
};
