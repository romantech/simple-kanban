'use client';

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
import { Input } from './ui/input';
import { Button } from '@/components/ui/button';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { type PropsWithChildren, useState } from 'react';
import { addColumnSchema, type AddColumnSchema } from '@/lib';
import { Label } from '@/components/ui/label';

const [fieldName] = addColumnSchema.keyof().options;

const AddColumnDialog = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);

  const addColumn = useKanbanStore.use.addColumn();
  const { register, handleSubmit, reset, formState } = useForm<AddColumnSchema>({
    resolver: zodResolver(addColumnSchema),
  });

  const onSubmit: SubmitHandler<AddColumnSchema> = (data) => {
    addColumn(data.title);
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <DialogHeader>
            <DialogTitle>새로운 컬럼 추가</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-7">
            <Label htmlFor={fieldName}>컬럼 이름</Label>
            <Input {...register(fieldName)} placeholder="최대 50자까지 입력할 수 있어요" />
            <ErrorMessage
              errors={formState.errors}
              name={fieldName}
              render={({ message }) => <p className="text-sm text-baltic-400">{message}</p>}
            />
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

export { AddColumnDialog };
