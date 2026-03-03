import { Ratelimit } from '@unkey/ratelimit';
import { Unkey } from '@unkey/api';
import { nanoid } from 'nanoid';
import { type ClientInfo, getClientInfo, getEnv, isDev } from '@/lib/utils';
import { type NextRequest, type NextResponse } from 'next/server';
import { type Code } from '@unkey/api/models/components';

export const UNKEY_COOKIE_NAME = 'unkey_session';
export const KEY_EXPIRY_HOURS = 72;

export const SUBTASK_DAILY_CREDIT = 10;
export const SUBTASK_GLOBAL_DAILY_LIMIT = 100;
export const SUBTASK_PREFIX = 'subtask';
export const SUBTASK_GLOBAL_NAMESPACE = 'kanban_subtask_global';

/**
 * 전체 사용량 제한
 * */
export const createSubtaskGlobalLimiter = () =>
  new Ratelimit({
    namespace: SUBTASK_GLOBAL_NAMESPACE,
    limit: SUBTASK_GLOBAL_DAILY_LIMIT, // 하루 총 100번으로 제한
    duration: 24 * 60 * 60 * 1000, // 1일 후 초기화
    rootKey: getEnv('UNKEY_ROOT_KEY'),
  });

export async function createSubtaskUnkey(meta: ClientInfo) {
  const unkey = new Unkey({ rootKey: getEnv('UNKEY_ROOT_KEY') });

  try {
    const externalId = nanoid(10);

    const { data } = await unkey.keys.createKey({
      apiId: getEnv('UNKEY_API_ID'),
      prefix: SUBTASK_PREFIX, // 키에 추가될 접두사
      externalId,
      name: meta.realIp ?? meta.ip ?? 'unknown',
      meta: { createdAt: new Date().toISOString(), ...meta },
      expires: Date.now() + KEY_EXPIRY_HOURS * 60 * 60 * 1000,
      credits: {
        remaining: SUBTASK_DAILY_CREDIT,
        // 자정마다 amount 만큼 remaining 리셋
        refill: { interval: 'daily', amount: SUBTASK_DAILY_CREDIT },
      },
      // v2: ratelimit 단일 오브젝트 -> ratelimits 배열, async -> autoApply
      // 1초간 2번 요청 허용
      ratelimits: [{ name: SUBTASK_PREFIX, limit: 2, duration: 1000, autoApply: true }],
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

  if (!newKey) return { unkeyValue: null, isNewKey: false };
  return { unkeyValue: newKey, isNewKey: true };
};

export const setUnkeySessionCookie = (response: NextResponse, unkeyValue: string) => {
  response.cookies.set({
    name: UNKEY_COOKIE_NAME,
    value: unkeyValue,
    httpOnly: true, // 자바스크립트로 쿠키 접근 제한(document.cookie)
    secure: !isDev(), // HTTPS 연결에서만 쿠키 전송
    maxAge: KEY_EXPIRY_HOURS * 60 * 60, // 쿠키 만료 시간 (초 단위)
    sameSite: 'strict', // 동일 사이트 요청에서만 쿠키 전송
    path: '/api', // /api 경로에서만 쿠키 전송
  });
};

export type UnkeyStatusCode = keyof typeof unkeyStatusCodeMap;
/**
 * Mapping of Unkey error codes to HTTP status codes and user-friendly messages
 */
export const unkeyStatusCodeMap = {
  VALID: { status: 200, message: 'Valid API key' },
  NOT_FOUND: { status: 404, message: 'API key not found' },
  FORBIDDEN: { status: 403, message: 'Verification failed' },
  USAGE_EXCEEDED: { status: 429, message: 'Usage quota exceeded' },
  RATE_LIMITED: { status: 429, message: 'Rate limit exceeded' },
  DISABLED: { status: 410, message: 'API key deactivated' },
  INSUFFICIENT_PERMISSIONS: { status: 403, message: 'Insufficient permissions' },
  EXPIRED: { status: 401, message: 'API key expired' },
} satisfies Record<Code, { status: number; message: string }>;

export const isUnkeyStatusCode = (code: unknown): code is UnkeyStatusCode => {
  return typeof code === 'string' && Object.hasOwn(unkeyStatusCodeMap, code);
};
