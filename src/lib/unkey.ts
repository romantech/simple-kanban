import { Ratelimit, type RatelimitConfig } from '@unkey/ratelimit';

export const createSubtaskLimiter = (config?: Partial<RatelimitConfig>) => {
  if (!process.env.UNKEY_ROOT_KEY) throw new Error('UNKEY_ROOT_KEY is not defined');

  return new Ratelimit({
    namespace: 'kanban.subtask',
    limit: 30,
    duration: '12h',
    ...config,
    rootKey: process.env.UNKEY_ROOT_KEY,
    // Async mode is disabled for now - enable when needed for higher throughput
    // async: true
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
