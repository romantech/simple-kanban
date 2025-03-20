'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import { cn, TaskConfig } from '@/lib';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { BadgeAI } from '@/components/ui/badge-ai';
import { type AddTaskSchema } from '@/schema';

interface EditTaskFormContentProps {
  className?: string;
  autoSubtasks?: boolean;
}

const TaskEditForm = ({ className, autoSubtasks = false }: EditTaskFormContentProps) => {
  const { register, formState, control } = useFormContext<AddTaskSchema>();

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-baltic-400">
          작업 이름 (필수)
        </Label>
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
        <Label htmlFor="description" className="text-baltic-400">
          작업 설명 (선택)
        </Label>
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
      {autoSubtasks && (
        <FormField
          control={control}
          name="autoSubtasks"
          render={({ field }) => (
            <FormItem className="relative flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-2 leading-none">
                <FormLabel>
                  하위 작업 자동 생성 <BadgeAI />
                </FormLabel>
                <FormDescription>
                  작업 이름과 설명을 기반으로 하위 작업을 자동 생성합니다. (최대 10개)
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export { TaskEditForm };
