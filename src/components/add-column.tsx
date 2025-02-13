'use client';

import { SquarePlus } from 'lucide-react';
import { useKanbanStore } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { useState } from 'react';

const formSchema = z.object({
  columnName: z
    .string()
    .trim()
    .min(1, { message: '최소 1글자 이상 입력해주세요' })
    .max(20, { message: '최대 20자까지만 입력할 수 있어요' }),
});

const [fieldName] = formSchema.keyof().options;
type FormSchema = z.infer<typeof formSchema>;

const AddColumn = () => {
  const [isOpen, setIsOpen] = useState(false);

  const addColumn = useKanbanStore.use.addColumn();
  const { register, handleSubmit, reset, formState } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    addColumn(data.columnName);
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex h-full w-[210px] items-center justify-center gap-1 rounded-md bg-baltic-900/30 text-xl font-bold capitalize text-baltic-400 shadow-md outline-none transition-all hover:bg-baltic-900/50 active:scale-95">
          <SquarePlus height={20} /> add column
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <DialogHeader>
            <DialogTitle>새로운 컬럼 추가</DialogTitle>
            <DialogDescription>컬럼 이름을 입력하세요</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 py-6">
            <Input {...register(fieldName)} placeholder="최대 20자까지 입력할 수 있어요" />
            <ErrorMessage
              errors={formState.errors}
              name={fieldName}
              render={({ message }) => <p className="text-sm text-baltic-400">{message}</p>}
            />
          </div>
          <DialogFooter>
            <Button type="submit">추가</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddColumn };
