import { Ratelimit, type RatelimitConfig } from '@unkey/ratelimit';
import { Unkey } from '@unkey/api';
import { nanoid } from 'nanoid';
import { addHours } from 'date-fns';
import { type ClientInfo, getClientInfo, getEnv, isDev } from '@/lib/utils';
import { type NextRequest, type NextResponse } from 'next/server';

export const UNKEY_COOKIE_NAME = 'unkey_session';
export const UNKEY_EXPIRY_HOURS = 72;
export const UNKEY_SUBTASK_LIMIT = 30;
export const UNKEY_NAMESPACE = { SUBTASK: 'kanban.subtask' } as const;

export const createSubtaskLimiter = (config?: Partial<RatelimitConfig>) => {
  return new Ratelimit({
    namespace: UNKEY_NAMESPACE.SUBTASK,
    limit: UNKEY_SUBTASK_LIMIT,
    duration: UNKEY_EXPIRY_HOURS * 60 * 60 * 1000,
    ...config,
    rootKey: getEnv('UNKEY_ROOT_KEY'),
    disableTelemetry: true,
    // async: true -> 글로벌 엣지 노드에서 독립적으로 카운트하고 비동기적으로 글로벌 상태 동기화.
    // 순간적으로 전체 제한을 초과할 수 있지만(정확도 98%) 속도 빠름(0ms 레이턴시 오버헤드). 일반적인 API는 async 권장
    // async: false -> 중앙 집중식 처리로 글로벌 카운터를 관리하기 때문에 레이턴시는 다소 증가하지만 엄격한 제한 적용
    async: true,
  });
};

export async function createSubtaskUnkey(meta: ClientInfo) {
  const unkey = new Unkey({ rootKey: getEnv('UNKEY_ROOT_KEY'), disableTelemetry: true });

  try {
    const ownerId = nanoid(10);
    const { result, error } = await unkey.keys.create({
      apiId: getEnv('UNKEY_API_ID'),
      prefix: UNKEY_NAMESPACE.SUBTASK, // 키에 추가될 접두사
      ownerId: ownerId, // 유저 식별을 위한 ID
      name: meta.realIp ?? meta.ip ?? 'unknown',
      meta: { createdAt: new Date().toISOString(), ...meta },
      expires: addHours(new Date(), UNKEY_EXPIRY_HOURS).getTime(),
      ratelimit: { duration: 1000, limit: 2, async: true }, // 1초간 2번 요청 허용
      remaining: UNKEY_SUBTASK_LIMIT,
      refill: { interval: 'daily', amount: UNKEY_SUBTASK_LIMIT }, // 자정마다 amount 만큼 remaining 리셋
      enabled: true,
    });

    if (error) {
      console.error(error.message);
      return null;
    }

    console.log(`Created new Unkey key for user ${ownerId}`);
    return result.key;
  } catch (error) {
    console.error('Failed to create Unkey key', error);
    return null;
  }
}

export const retrieveSubtaskUnkey = async (req: NextRequest) => {
  let isNewKey = false;
  let unkeyValue = req.cookies.get(UNKEY_COOKIE_NAME)?.value ?? null;

  if (!unkeyValue) {
    isNewKey = true;
    const clientInfo = getClientInfo(req);
    unkeyValue = await createSubtaskUnkey(clientInfo);
  }

  return { unkeyValue, isNewKey };
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

export type UnkeyErrorCode = keyof typeof unkeyErrorMap;
/**
 * Mapping of Unkey error codes to HTTP status codes and user-friendly messages
 */
export const unkeyErrorMap = {
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
  UNAUTHORIZED: {
    status: 401,
    message: 'Unauthorized',
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
};
