'use client';

import { CirclePlus } from 'lucide-react';
import { useKanbanStore } from '@/store';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { addTaskSchema, type AddTaskSchema, type ColumnId } from '@/lib';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from '@/components/ui/button';
import { Label } from './ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface AddTaskProps {
  columnId: ColumnId;
}

const AddTaskDialog = ({ columnId }: AddTaskProps) => {
  const addTask = useKanbanStore.use.addTask();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<AddTaskSchema>({
    resolver: zodResolver(addTaskSchema),
  });

  const onSubmit: SubmitHandler<AddTaskSchema> = (data) => {
    addTask(columnId, data.title, data.description);
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full cursor-pointer items-center justify-start gap-1 rounded-md border border-baltic-900 p-2 text-xs font-semibold capitalize text-baltic-200 shadow-md transition-all hover:bg-charade-950 active:scale-95">
          <CirclePlus height={14} />
          add task
        </button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <DialogHeader>
            <DialogTitle>새로운 작업 추가</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-7">
            <div className="space-y-2">
              <Label htmlFor="title">작업 이름 (필수)</Label>
              <Input {...register('title')} placeholder="최대 50자까지 입력할 수 있어요" />
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
                placeholder="최대 500자까지 입력할 수 있어요"
                autoComplete="off"
                rows={5}
              />
              <ErrorMessage
                errors={formState.errors}
                name={'description'}
                render={({ message }) => <p className="text-sm text-baltic-400">{message}</p>}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                취소
              </Button>
            </DialogClose>
            <Button type="submit">추가</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddTaskDialog };
