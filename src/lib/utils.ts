import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { type NextRequest, userAgent } from 'next/server';

export const isDev = () => process.env.NODE_ENV === 'development';

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

export const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not defined`);
  return value;
};

export type ClientInfo = ReturnType<typeof getClientInfo>;
export const getClientInfo = (req: NextRequest) => {
  const { browser, os, device, isBot } = userAgent(req);
  const agent = { browser, os, device, isBot };

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const realIp = req.headers.get('x-real-ip') ?? 'unknown';

  const country = req.headers.get('x-vercel-ip-country') ?? 'unknown';
  const city = req.headers.get('x-vercel-ip-city') ?? 'unknown';

  const referrer = req.headers.get('referer')?.replace(/https?:\/\/([^/]+).*/i, '$1') ?? 'direct';

  return { agent, ip, realIp, country, city, referrer };
};
