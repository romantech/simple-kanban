import { NextResponse } from 'next/server';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? [];
const allowedHeaders = [
  'X-CSRF-Token', // CSRF 토큰: 교차 사이트 요청 위조 방지를 위해 사용됨
  'X-Requested-With', // AJAX 요청을 식별: 주로 XMLHttpRequest 에서 사용
  'Accept', // 클라이언트가 수용 가능한 응답 콘텐츠 타입 지정
  'Accept-Version', // 클라이언트가 허용하는 API 버전 지정
  'Content-Length', // 요청 본문의 길이를 바이트 단위로 나타냄
  'Content-MD5', // 요청 본문의 무결성 검증을 위한 해시 값 제공
  'Content-Type', // 요청 본문의 미디어 타입 지정
  'Date', // 요청 전송 시의 날짜와 시간 지정
  'X-Api-Version', // 클라이언트가 사용하는 API 버전 지정
  'Authorization', // 인증을 위한 자격 증명 포함
].join(',');
const allowedMethods = ['GET', 'POST', 'OPTIONS'].join(',');

export const corsConfig = { allowedOrigins, allowedHeaders, allowedMethods } as const;

export const setCorsHeaders = (response: NextResponse, origin: string) => {
  // 캐시 시스템(브라우저, CDN, 프록시 서버 등)에게 Origin 헤더에 따라 응답이 달라질 수 있음을 알림
  response.headers.set('Vary', 'Origin');

  if (corsConfig.allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  response.headers.set('Access-Control-Allow-Methods', corsConfig.allowedMethods);
  response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders);
  // 다른 출처에서 열린 페이지와 상호작용 제한(악의적인 스크립트가 window.opener를 통해 접근하는 것 방지)
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  // 리소스(이미지, 폰트, 스크립트 등)를 동일 사이트 내에서만 로드되도록 제한하여 데이터 노출 위험 감소
  response.headers.set('Cross-Origin-Resource-Policy', 'same-site');
  // 브라우저에게 2년 동안 해당 도메인에 대해 HTTPS 연결만 사용하도록 강제
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
};

export const handleCors = (isPreflight: boolean, origin: string) => {
  if (isPreflight) {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders(response, origin);
    response.headers.set('Access-Control-Max-Age', '86400'); // 24시간 동안 preflight 결과 캐싱

    return response;
  }

  if (!corsConfig.allowedOrigins.includes(origin)) {
    console.error(`CORS policy violation: Blocked request from unauthorized origin: ${origin}`);
    return new NextResponse('Blocked by CORS policy', {
      status: 403,
      statusText: 'Origin not allowed',
    });
  }

  return null;
};
