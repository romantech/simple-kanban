import { type NextRequest, NextResponse } from 'next/server';
import {
  createSubtaskUnkey,
  getClientInfo,
  handleCors,
  setCorsHeaders,
  UNKEY_COOKIE_NAME,
} from '@/lib';

// 미들웨어 파일은 프로젝트에서 1개만 존재 할 수 있으며, 기본적으로 Edge 런타임에서 실행됨
// Edge 런타임에선 요청마다 독립적인 실행 환경(별도 인스턴스)으로 실행됨
export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  const isPreflight = req.method === 'OPTIONS';

  // corsResponse 존재하면 해당 응답을 클라이언트로 즉시 반환(미들웨어 체인 중단)
  const corsResponse = handleCors(isPreflight, origin);
  if (corsResponse) return corsResponse;

  // 비즈니스 로직 처리. NextResponse.next() 함수는 현재 요청을 다음 처리 단계(후속 핸들러)로 전달함
  const response = NextResponse.next();
  const clientInfo = getClientInfo(req);

  let unkeyKey = req.cookies.get(UNKEY_COOKIE_NAME)?.value ?? null;
  if (!unkeyKey) unkeyKey = await createSubtaskUnkey(response, clientInfo);

  // Next.js 에서 Request 객체는 기본적으로 불변으로 취급하기 때문에 헤더/쿠키는 응답 객체에서 설정 필요
  // 미들웨어에서 헤더를 수정하면 현재 요청 생명주기 내에서 유효 (Next.js 라우트의 request 객체에서 확인 가능)
  // 미들웨어에서 쿠키를 수정하면 클라이언트에 set-Cookie 헤더로 전달되며, 다음 요청 생명주기부터 적용
  response.headers.set('Authorization', `Bearer ${unkeyKey}`);

  // CORS 헤더 설정
  setCorsHeaders(response, origin);
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
