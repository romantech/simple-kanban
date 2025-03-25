import { Ratelimit, type RatelimitConfig } from '@unkey/ratelimit';
import { type NextResponse } from 'next/server';
import { Unkey } from '@unkey/api';
import { nanoid } from 'nanoid';
import { addHours } from 'date-fns';
import { type ClientInfo, getEnv } from '@/lib/utils';

export const UNKEY_COOKIE_NAME = 'unkey_session';
export const UNKEY_EXPIRY_HOURS = 72;
export const SUBTASK_RATE_LIMIT = 30;
export const UNKEY_NAMESPACE = { SUBTASK: 'kanban.subtask' } as const;

export const createSubtaskLimiter = (config?: Partial<RatelimitConfig>) => {
  return new Ratelimit({
    namespace: UNKEY_NAMESPACE.SUBTASK,
    limit: SUBTASK_RATE_LIMIT,
    duration: UNKEY_EXPIRY_HOURS * 60 * 60 * 1000,
    ...config,
    rootKey: getEnv('UNKEY_ROOT_KEY'),
    // Async mode is disabled for now - enable when needed for higher throughput
    // async: true
  });
};

export async function createSubtaskUnkey(response: NextResponse, meta: ClientInfo) {
  const unkey = new Unkey({ rootKey: getEnv('UNKEY_ROOT_KEY'), disableTelemetry: true });

  try {
    const ownerId = nanoid(10);
    const { result, error } = await unkey.keys.create({
      apiId: getEnv('UNKEY_API_ID'),
      prefix: UNKEY_NAMESPACE.SUBTASK,
      ownerId: ownerId, // 클라이언트에서 유저 식별을 위한 ID
      name: meta.ip,
      meta: { createdAt: new Date().toISOString(), ...meta },
      expires: addHours(new Date(), UNKEY_EXPIRY_HOURS).getTime(),
      ratelimit: { duration: 1000, limit: 2 }, // 1초간 2번 요청 허용
      remaining: SUBTASK_RATE_LIMIT,
      refill: { interval: 'daily', amount: SUBTASK_RATE_LIMIT }, // 자정마다 amount 만큼 remaining 리셋
      enabled: true,
    });

    if (error) {
      console.error(error.message);
      return null;
    }

    // 쿠키에 새 키 설정
    response.cookies.set({
      name: UNKEY_COOKIE_NAME,
      value: result.key,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * UNKEY_EXPIRY_HOURS,
      sameSite: 'strict',
      path: '/api',
    });

    console.log(`Created new Unkey key for user ${ownerId}`);
    return result.key;
  } catch (error) {
    console.error('Failed to create Unkey key', error);
    return null;
  }
}

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
