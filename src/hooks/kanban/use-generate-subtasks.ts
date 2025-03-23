'use client';

import { useRequest } from 'ahooks';
import { generateAISubtasks } from '@/services/subtask';
import { toast } from 'sonner';

export const useGenerateSubtasks = () => {
  const { data, run, runAsync, ...results } = useRequest(generateAISubtasks, {
    manual: true,
    onSuccess: ({ subtasks }) => {
      toast.success(`하위 작업 ${subtasks.length}개가 생성되었습니다.`, { position: 'top-center' });
    },
    onError: (error) => {
      toast.error('하위 작업 생성에 실패했습니다.', {
        position: 'top-center',
        description: error.message,
      });
    },
  });

  return {
    ...results,
    generateSubtasks: run,
    generateSubtasksAsync: runAsync,
    subtaskList: data?.subtasks,
  };
};
