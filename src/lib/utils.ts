import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { type Active, type Over } from '@dnd-kit/core';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getISODate = () => {
  return new Date().toISOString();
};

export const formatKoDate = (date: string | Date) => {
  return format(date, 'yyyy-MM-dd(eee) HH:mm', { locale: ko });
};

export const getDragTypes = (active: Active, over?: Over) => {
  const activeData = active.data.current;
  const overData = over?.data.current;

  if (!activeData) throw new Error('Drag data is missing for active or over element');

  return {
    isActiveTask: activeData.type === 'task',
    isOverTask: overData?.type === 'task',
    isActiveColumn: activeData.type === 'column',
    isOverColumn: overData?.type === 'column',
  };
};
