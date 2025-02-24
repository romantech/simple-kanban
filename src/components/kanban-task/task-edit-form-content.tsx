'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import { cn, TaskConfig } from '@/lib';

interface EditTaskFormContentProps {
  className?: string;
}

const TaskEditFormContent = ({ className }: EditTaskFormContentProps) => {
  const { register, formState } = useFormContext();

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label htmlFor="title">작업 이름 (필수)</Label>
        <Input
          {...register('title')}
          placeholder={`최대 ${TaskConfig.title.max}자까지 입력할 수 있어요`}
          maxLength={TaskConfig.title.max}
          minLength={TaskConfig.title.min}
          autoFocus
        />
        <ErrorMessage
          errors={formState.errors}
          name={'title'}
          render={({ message }) => <p className="text-sm text-baltic-400">{message}</p>}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">작업 설명 (선택)</Label>
        <Textarea
          {...register('description')}
          placeholder={`최대 ${TaskConfig.desc.max}자까지 입력할 수 있어요`}
          autoComplete="off"
          rows={5}
          maxLength={TaskConfig.desc.max}
        />
        <ErrorMessage
          errors={formState.errors}
          name={'description'}
          render={({ message }) => <p className="text-sm text-baltic-400">{message}</p>}
        />
      </div>
    </div>
  );
};

export { TaskEditFormContent };
