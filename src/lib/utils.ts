import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getISODate = () => {
  return new Date().toISOString();
};

export const formatKoDate = (date: string | Date) => {
  return format(date, 'yyyy-MM-dd(eee) HH:mm', { locale: ko });
};
