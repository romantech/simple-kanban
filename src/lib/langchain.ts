import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { generateSubtaskTemplate, getEnv } from '@/lib';
import { subtaskOutputSchema } from '@/schema/kanban';

export const createSubtaskChain = () => {
  const model = new ChatOpenAI({
    model: getEnv('AI_MODEL_SUBTASK'),
    reasoning: { effort: 'none' },
  });

  const prompt = ChatPromptTemplate.fromTemplate(generateSubtaskTemplate);
  const structuredLlm = model.withStructuredOutput(subtaskOutputSchema, {
    name: 'output_formatter',
  });

  return prompt.pipe(structuredLlm);
};
