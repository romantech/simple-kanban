export interface GenerateAISubtasks {
  title: string;
  description?: string;
}

interface ResponseData {
  success: boolean;
  data: string[];
}

export const generateAISubtasks = async (params: GenerateAISubtasks) => {
  const res = await fetch('/api/subtask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error(`${res.statusText} (${res.status})`);

  const { data } = (await res.json()) as ResponseData;
  return data;
};
