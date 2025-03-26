import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { errorResponse, generateSubtaskTemplate, getEnv, successResponse } from '@/lib';
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
const subtaskModel = process.env.AI_MODEL_SUBTASK ?? 'gpt-4o-mini';

export const POST = withUnkey(
  async (req) => {
    const parsedBody = subtaskRequestSchema.safeParse(await req.json());
    if (!parsedBody.success) {
      console.error('Validation error:', parsedBody.error.errors);
      return errorResponse.zod(parsedBody.error);
    }

    try {
      const { title, description } = parsedBody.data;

      const model = new ChatOpenAI({ model: subtaskModel, temperature: 0.6 });
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
    disableTelemetry: true,
    apiId: getEnv('UNKEY_API_ID'),
    handleInvalidKey: (_req, res) => {
      console.error('API key validation failed:', res?.code);
      return errorResponse.rateLimit(res?.code);
    },
  },
);
