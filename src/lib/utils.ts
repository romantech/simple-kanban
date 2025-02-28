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

export const formatKoDate = (date: string | Date, includeTime?: boolean) => {
  const formatStr = includeTime ? 'yyyy-MM-dd(eee) HH:mm' : 'yyyy-MM-dd(eee)';
  return format(date, formatStr, { locale: ko });
};

export const arrayMove = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const newArray = array.slice();
  const [movedItem] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, movedItem);

  return newArray;
};
