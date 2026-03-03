import { Ratelimit, type RatelimitConfig } from '@unkey/ratelimit';
import { Unkey } from '@unkey/api';
import { nanoid } from 'nanoid';
import { addHours } from 'date-fns';
import { type ClientInfo, getClientInfo, getEnv, isDev } from '@/lib/utils';
import { type NextRequest, type NextResponse } from 'next/server';
import { type Code } from '@unkey/api/models/components';

export const UNKEY_COOKIE_NAME = 'unkey_session';
export const UNKEY_EXPIRY_HOURS = 72;
export const UNKEY_SUBTASK_LIMIT = 30;
export const UNKEY_NAMESPACE = { SUBTASK: 'subtask' } as const;

export const createSubtaskLimiter = (config?: Partial<RatelimitConfig>) => {
  return new Ratelimit({
    namespace: UNKEY_NAMESPACE.SUBTASK,
    limit: UNKEY_SUBTASK_LIMIT,
    duration: UNKEY_EXPIRY_HOURS * 60 * 60 * 1000,
    ...config,
    rootKey: getEnv('UNKEY_ROOT_KEY'),
  });
};

export async function createSubtaskUnkey(meta: ClientInfo) {
  const unkey = new Unkey({ rootKey: getEnv('UNKEY_ROOT_KEY') });

  try {
    const externalId = nanoid(10);

    const { data } = await unkey.keys.createKey({
      apiId: getEnv('UNKEY_API_ID'),
      prefix: UNKEY_NAMESPACE.SUBTASK, // 키에 추가될 접두사
      externalId,
      name: meta.realIp ?? meta.ip ?? 'unknown',
      meta: { createdAt: new Date().toISOString(), ...meta },
      expires: addHours(new Date(), UNKEY_EXPIRY_HOURS).getTime(),
      credits: {
        remaining: UNKEY_SUBTASK_LIMIT,
        // 자정마다 amount 만큼 remaining 리셋
        refill: { interval: 'daily', amount: UNKEY_SUBTASK_LIMIT },
      },
      // v2: ratelimit 단일 오브젝트 -> ratelimits 배열, async -> autoApply
      // 1초간 2번 요청 허용
      ratelimits: [{ name: 'subtask', limit: 2, duration: 1000, autoApply: true }],
      enabled: true,
    });

    console.log(`Created new Unkey key for user ${externalId}`);
    return data.key;
  } catch (error) {
    console.error('Failed to create Unkey key', error);
    return null;
  }
}

export const retrieveSubtaskUnkey = async (req: NextRequest) => {
  const unkeyValue = req.cookies.get(UNKEY_COOKIE_NAME)?.value ?? null;
  if (unkeyValue) return { unkeyValue, isNewKey: false };

  const clientInfo = getClientInfo(req);
  const newKey = await createSubtaskUnkey(clientInfo);

  return { unkeyValue: newKey, isNewKey: true };
};

export const setUnkeySessionCookie = (response: NextResponse, unkeyValue: string) => {
  response.cookies.set({
    name: UNKEY_COOKIE_NAME,
    value: unkeyValue,
    httpOnly: true, // 자바스크립트로 쿠키 접근 제한(document.cookie)
    secure: !isDev(), // HTTPS 연결에서만 쿠키 전송
    maxAge: 60 * 60 * UNKEY_EXPIRY_HOURS, // 쿠키 만료 시간 (초 단위)
    sameSite: 'strict', // 동일 사이트 요청에서만 쿠키 전송
    path: '/api', // /api 경로에서만 쿠키 전송
  });
};

export type UnkeyStatusCode = keyof typeof unkeyStatusCodeMap;
/**
 * Mapping of Unkey error codes to HTTP status codes and user-friendly messages
 */
export const unkeyStatusCodeMap = {
  VALID: {
    status: 200,
    message: 'Valid API key',
  },
  NOT_FOUND: {
    status: 404,
    message: 'API key not found',
  },
  FORBIDDEN: {
    status: 403,
    message: 'Verification failed',
  },
  USAGE_EXCEEDED: {
    status: 429,
    message: 'Usage quota exceeded',
  },
  RATE_LIMITED: {
    status: 429,
    message: 'Rate limit exceeded',
  },
  DISABLED: {
    status: 410,
    message: 'API key deactivated',
  },
  INSUFFICIENT_PERMISSIONS: {
    status: 403,
    message: 'Insufficient permissions',
  },
  EXPIRED: {
    status: 401,
    message: 'API key expired',
  },
} satisfies Record<Code, { status: number; message: string }>;

export const isUnkeyStatusCode = (code: unknown): code is UnkeyStatusCode => {
  return typeof code === 'string' && Object.hasOwn(unkeyStatusCodeMap, code);
};
