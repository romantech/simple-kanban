import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createTitleSchema } from '@/schema';
import { PromptTemplate } from '@langchain/core/prompts';

const reqBodySchema = z.object({
  title: createTitleSchema(),
  description: z.string().optional(),
});

const generateSubtaskSchema = z.object({ subtasks: z.array(z.string().describe('Subtask title')) });

const generateSubtaskTemplate = `Generate up to 10 subtasks for {title}, placing higher-priority tasks toward the beginning of the array. Refer to {description} for task details. Write in Korean.`;

export async function POST(req: Request) {
  const body = await req.json();
  const parsedBody = reqBodySchema.safeParse(body);

  if (!parsedBody.success) {
    const errors = parsedBody.error.flatten();

    return NextResponse.json(
      {
        success: false,
        error: { message: 'Invalid request body', issues: errors.fieldErrors },
      },
      { status: 400 },
    );
  }

  try {
    const { title, description } = parsedBody.data;
    const model = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.1 });
    const prompt = PromptTemplate.fromTemplate(generateSubtaskTemplate);
    const structuredLlm = model.withStructuredOutput(generateSubtaskSchema, {
      name: 'output_formatter',
    });
    const chain = prompt.pipe(structuredLlm);
    const { subtasks } = await chain.invoke({ title, description });

    return NextResponse.json({ success: true, data: subtasks }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal Server Error' } },
      { status: 500 },
    );
  }
}
