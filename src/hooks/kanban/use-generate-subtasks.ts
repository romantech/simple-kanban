'use client';

import { useRequest } from 'ahooks';
import { generateSubtasks } from '@/services/subtask';
import { generateSubtask } from '@/lib';
import { toast } from 'sonner';
import { type TaskDef } from '@/schema';
import { useKanbanStore } from '@/store';

export const useGenerateSubtasks = ({ id, title, description }: TaskDef) => {
  const addSubtask = useKanbanStore.use.addSubtask();
  const clearAIGeneratedSubtasks = useKanbanStore.use.clearAIGeneratedSubtasks();

  return useRequest(() => generateSubtasks({ title, description }), {
    manual: true,
    onSuccess: (subtasks) => {
      clearAIGeneratedSubtasks(id);
      subtasks.forEach((subtaskTitle) => {
        const subtask = generateSubtask({ taskId: id, title: subtaskTitle, generatedByAI: true });
        addSubtask(subtask);
      });
      toast.success(`하위 작업 ${subtasks.length}개가 생성되었습니다.`);
    },
    onError: (error) => {
      toast.error('하위 작업 생성에 실패했습니다', { description: error.message });
    },
  });
};
