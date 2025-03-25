import { type SubtaskOutput, subtaskOutputSchema, type SubtaskRequest } from '@/schema';
import { type APIResponse, isAPIResponse } from '@/types';
import axios, { isAxiosError } from 'axios';

export const generateAISubtasks = async (params: SubtaskRequest) => {
  try {
    const { data } = await axios.post<APIResponse<SubtaskOutput>>('/api/subtask', params, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      withCredentials: true, // 크로스 오리진 요청일 때 자격증명(쿠키, 인증 헤더 등) 함께 전송
    });

    const parsed = subtaskOutputSchema.safeParse(data.data);
    if (!parsed.success) throw new Error('Invalid subtask structure');

    return parsed.data;
  } catch (e) {
    if (!isAxiosError(e)) throw e;

    const { response, message } = e;
    const errorMessage = `${message}. ${isAPIResponse(response?.data) ? response.data.message : ''}`;
    throw new Error(errorMessage);
  }
};
