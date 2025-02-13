import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';
import { KanbanBrandType, type KanbanEntity } from '@/types';
import { z } from 'zod';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const generateId = <T extends KanbanEntity>(entity: T) => {
  const brand = KanbanBrandType[entity];
  return z.string().brand(brand).parse(`${entity}-${nanoid()}`);
};

export const generateIds = <T extends KanbanEntity>(type: T, count: number) => {
  return Array.from({ length: count }, () => generateId(type));
};

export const getISODate = () => {
  return new Date().toISOString();
};
