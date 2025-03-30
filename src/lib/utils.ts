import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { type NextRequest, userAgent } from 'next/server';

export const isDev = () => process.env.NODE_ENV === 'development';

export const parseRequestJSON = async <T = unknown>(req: Request): Promise<T | null> => {
  try {
    return (await req.json()) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
};

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getCurrentISODate = () => new Date().toISOString();

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
  // Next.js에서 제공하는 userAgent 함수를 사용하여 OS, 기기 등 정보 추출
  const { browser, os, device, isBot } = userAgent(req);
  // 추출한 정보를 agent 객체에 저장
  const agent = { browser, os, device, isBot };
  // 클라이언트의 원래 IP 주소와 요청이 거쳐온 프록시 서버들의 IP 주소를 추적하는 표준 헤더 (콤마로 구분)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  // 클라이언트의 실제 IP 주소
  const realIp = req.headers.get('x-real-ip');
  // 클라이언트의 국가 정보 예) KR
  const country = req.headers.get('x-vercel-ip-country');
  // 클라이언트의 도시 정보 예) Seoul
  const city = req.headers.get('x-vercel-ip-city');
  // 리퍼러 정보
  const referrer = req.headers.get('referer')?.replace(/https?:\/\/([^/]+).*/i, '$1') ?? 'direct';

  return { agent, ip, realIp, country, city, referrer };
};
