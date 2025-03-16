import { ChatOpenAI } from '@langchain/openai';
import { NextResponse } from 'next/server';
import { PromptTemplate } from '@langchain/core/prompts';
import { generateSubtaskTemplate, handleError, handleZodError } from '@/lib';
import { generateSubtaskScheme, subtaskRequestBodySchema } from '@/schema/kanban';

// 사용자와 가까운 위치에서 실행해서 지연 시간 최소화
export const runtime = 'edge';

export async function POST(req: Request) {
  const body: unknown = await req.json();
  const parsedBody = subtaskRequestBodySchema.safeParse(body);

  if (!parsedBody.success) return handleZodError(parsedBody.error);

  try {
    const { title, description } = parsedBody.data;

    const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.6 });
    const prompt = PromptTemplate.fromTemplate(generateSubtaskTemplate);
    const structuredLlm = model.withStructuredOutput(generateSubtaskScheme, {
      name: 'output_formatter',
    });
    const chain = prompt.pipe(structuredLlm);

    const { subtasks } = await chain.invoke({ title, description });

    return NextResponse.json({ success: true, data: subtasks });
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}
