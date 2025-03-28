import { type NextRequest, NextResponse } from 'next/server';
import { handleCors, retrieveSubtaskUnkey, setCorsHeaders, setUnkeySessionCookie } from '@/lib';

// 미들웨어 파일은 프로젝트에서 1개만 존재 할 수 있으며, 기본적으로 Edge 런타임에서 실행됨
// Edge 런타임에선 요청마다 독립적인 실행 환경을 가짐(요청마다 별도 인스턴스)
export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') ?? '';
  const isPreflight = req.method === 'OPTIONS';

  // corsResponse 객체 존재하면 해당 응답을 클라이언트로 즉시 반환(미들웨어 체인 중단)
  const corsResponse = handleCors(isPreflight, origin);
  if (corsResponse) return corsResponse;

  // ========= 비즈니스 로직 ========= //
  // 미들웨어에서 요청 헤더를 수정하면 현재 요청에서 업스트림으로 전파 (API 라우트 요청 객체에서 확인 가능)
  // 미들웨어에서 응답 쿠키를 수정하면 Set-Cookie 헤더가 응답에 추가되며, 다음 요청 시 요청 객체에서 확인 가능
  const { unkeyValue, isNewKey } = await retrieveSubtaskUnkey(req);

  // Request 객체는 "읽기전용"이기 때문에 요청 헤더를 수정하려면 헤더 복제/수정 → 응답 객체에서 헤더 덮어쓰는 작업 필요
  const headers = new Headers(req.headers);
  headers.set('Authorization', `Bearer ${unkeyValue}`);
  // NextResponse.next() 함수는 현재 요청을 다음 처리 단계(후속 핸들러)로 전달함
  const response = NextResponse.next({ request: { headers } }); // 복제한 헤더를 포함한 요청 객체 생성
  if (isNewKey && unkeyValue) setUnkeySessionCookie(response, unkeyValue);

  // ========= CORS 헤더 설정 =========
  setCorsHeaders(response, origin);
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
