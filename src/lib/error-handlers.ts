import { NextResponse } from 'next/server';
import { type ZodError } from 'zod';

const createErrorResponse = (message: string, status: number, issues?: Record<string, unknown>) => {
  return NextResponse.json(
    {
      success: false,
      error: { message, ...(issues && { issues }) },
    },
    { status },
  );
};

export const handleError = (error: unknown) => {
  const isErrorInstance = error instanceof Error;
  console.error(isErrorInstance ? error.stack : error);
  const errorMessage = isErrorInstance ? error.message : 'Internal Server Error';
  return createErrorResponse(errorMessage, 500);
};

export const handleZodError = (error: ZodError) => {
  return createErrorResponse('Invalid request body', 400, error.flatten().fieldErrors);
};
