import { NextResponse } from 'next/server';
import { type ZodError } from 'zod';
import { type UnkeyErrorCode, unkeyErrorMap } from '@/lib/unkey';

export interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const createResponse = <T>(
  response: APIResponse<T>,
  status = response.success ? 200 : 400,
  statusText?: string,
) => {
  return NextResponse.json(response, { status, statusText });
};

export const handleServerError = (error: unknown) => {
  const isErrorInstance = error instanceof Error;
  const errorMessage = isErrorInstance ? error.message : 'Internal Server Error';

  return createResponse({ success: false, message: errorMessage }, 500);
};

export const handleZodError = (error: ZodError) => {
  const [firstError] = error.errors;
  const message = `${firstError.path.join('.')} field ${firstError.message}`;

  return createResponse({ success: false, message }, 400);
};

export const handleRateLimitError = (code: UnkeyErrorCode, resetIn?: string) => {
  const { status, message } = unkeyErrorMap[code];
  const detailedMessage = resetIn ? `${message}. Retry after ${resetIn}` : message;

  return createResponse({ success: false, message: detailedMessage }, status, code);
};

export const successResponse = <T>(data: T, status = 200, message = 'Request successful') => {
  return createResponse({ success: true, data, message }, status);
};

export const errorResponse = {
  server: handleServerError,
  zod: handleZodError,
  rateLimit: handleRateLimitError,
};
