import { type NextRequest, NextResponse } from 'next/server';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',');

function setCorsHeaders(response: NextResponse, origin: string | null, includeOptions = false) {
  if (origin && allowedOrigins?.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  );
  const methods = includeOptions
    ? 'GET,DELETE,PATCH,POST,PUT,OPTIONS'
    : 'GET,DELETE,PATCH,POST,PUT';
  response.headers.set('Access-Control-Allow-Methods', methods);
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders(response, origin, true);
    response.headers.set('Access-Control-Max-Age', '86400'); // 24시간 동안 preflight 결과 캐싱
    return response;
  }

  const res = NextResponse.next();
  setCorsHeaders(res, origin);
  return res;
}

export const config = {
  matcher: '/api/:path*',
};
