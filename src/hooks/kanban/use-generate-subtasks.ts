'use client';

import { useRequest } from 'ahooks';
import { generateAISubtasks, type GenerateAISubtasks } from '@/services/subtask';
import { generateSubtask } from '@/lib';
import { toast } from 'sonner';
import { useKanbanStore } from '@/store';
import { type TaskId } from '@/schema';

export const useGenerateSubtasks = (taskId: TaskId) => {
  const addSubtask = useKanbanStore.use.addSubtask();
  const clearAIGeneratedSubtasks = useKanbanStore.use.clearAIGeneratedSubtasks();

  return useRequest((params: GenerateAISubtasks) => generateAISubtasks(params), {
    manual: true,
    onSuccess: (subtasks) => {
      clearAIGeneratedSubtasks(taskId);
      subtasks.forEach((title) => {
        const subtask = generateSubtask({ taskId, title, generatedByAI: true });
        addSubtask(subtask, false);
      });
      toast.success(`하위 작업 ${subtasks.length}개가 생성되었습니다.`);
    },
    onError: (error) => {
      toast.error('하위 작업 생성에 실패했습니다', { description: error.message });
    },
  });
};
