import { type APIResponse } from '@/lib';
import { type SubtaskOutput, subtaskOutputSchema, type SubtaskRequest } from '@/schema';

export const generateAISubtasks = async (params: SubtaskRequest) => {
  const res = await fetch('/api/subtask', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  let json: APIResponse<SubtaskOutput>;

  try {
    json = (await res.json()) as APIResponse<SubtaskOutput>;
  } catch (error) {
    console.error(error);
    throw new Error(`[${res.status}] ${res.statusText}`);
  }

  if (!res.ok) throw new Error(`[${res.status}] ${json.message}`);

  const parsed = subtaskOutputSchema.safeParse(json?.data);
  if (!parsed.success) throw new Error('Invalid subtask structure');

  return parsed.data;
};
