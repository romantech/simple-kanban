'use client';

import { useRequest } from 'ahooks';
import { generateAISubtasks } from '@/services/subtask';
import { toast } from 'sonner';

export const useSuggestSubtasks = () => {
  return useRequest(generateAISubtasks, {
    manual: true,
    onSuccess: (data) => {
      toast.success(`하위 작업 ${data.length}개가 생성되었습니다.`, { position: 'bottom-left' });
    },
    onError: () => {
      toast.error('하위 작업 생성에 실패했습니다.');
    },
  });
};
