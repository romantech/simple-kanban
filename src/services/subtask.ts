interface GenerateSubtasksParams {
  title: string;
  description?: string;
}

interface ResponseData {
  success: boolean;
  data: string[];
}

export const generateSubtasks = async (params: GenerateSubtasksParams) => {
  const res = await fetch('/api/subtask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error('Failed to generate subtasks');

  const { data } = (await res.json()) as ResponseData;
  return data;
};
