import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import {
  createSubtaskGlobalLimiter,
  errorResponse,
  generateSubtaskTemplate,
  getEnv,
  isUnkeyStatusCode,
  parseRequestJSON,
  successResponse,
  type UnkeyStatusCode,
} from '@/lib';
import { subtaskOutputSchema, subtaskRequestSchema } from '@/schema/kanban';
import { withUnkey } from '@unkey/nextjs';

/**
 * Edge 함수를 호출할 때마다 Invocations, Edge Request, Execution Units 항목 소비
 * Invocations: 호출할 때마다 +1 카운트 (hobby 요금제 월 10만까지 무료)
 * Edge Request: 엣지 네트워크에서 호출할 때마다 +1 카운트 (hobby 요금제 월 100만까지 무료)
 * Execution Units: 실제 CPU 사용 시간에 따라 유닛 소모 (hobby 요금제 월 50만까지 무료)
 * 외부 API 요청/응답을 기다리는 동안은 CPU를 사용하지 않으므로 유닛 소비 없음
 * 예를들어 반복문을 돌며 계산하는 작업은 CPU를 사용하므로 Execution Units 소비 (50ms = 1EU)
 * @see https://vercel.com/docs/pricing/edge-functions#managing-functions-invocations
 * */
export const runtime = 'edge';
const subtaskGlobalLimiter = createSubtaskGlobalLimiter();

export const POST = withUnkey(
  async (req) => {
    const parsedBody = subtaskRequestSchema.safeParse(await parseRequestJSON(req));
    if (!parsedBody.success) {
      console.error('Validation error:', parsedBody.error.errors);
      return errorResponse.zod(parsedBody.error);
    }

    // API 전체(전역) 사용량 제한. identifier를 고정값으로 두면 모든 요청이 같은 버킷 공유
    const globalLimit = await subtaskGlobalLimiter.limit('ALL');
    if (!globalLimit.success) {
      console.error('Global rate limit exceeded (subtask api)');
      return errorResponse.unkey('RATE_LIMITED');
    }

    try {
      const { title, description } = parsedBody.data;

      const model = new ChatOpenAI({ model: getEnv('AI_MODEL_SUBTASK'), temperature: 1 });
      const prompt = PromptTemplate.fromTemplate(generateSubtaskTemplate);
      const structuredLlm = model.withStructuredOutput(subtaskOutputSchema, {
        name: 'output_formatter',
      });
      const chain = prompt.pipe(structuredLlm);

      const result = await chain.invoke({ title, description });
      return successResponse(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Subtask generation failed:', errorMessage);
      return errorResponse.server(error);
    }
  },
  {
    rootKey: getEnv('UNKEY_ROOT_KEY'),
    // 기본적으로 Authorization 헤더에서 토큰 조회. getKey 메서드에서 토큰 조회 로직 커스텀 가능
    // getKey(req) { ... },
    handleInvalidKey(_req, result) {
      const { code } = result.data;
      console.error('API key validation failed:', code);

      const safeCode: UnkeyStatusCode = isUnkeyStatusCode(code) ? code : 'FORBIDDEN';
      return errorResponse.unkey(safeCode);
    },
  },
);
