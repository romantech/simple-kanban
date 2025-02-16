'use client';

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
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { type PropsWithChildren, useState } from 'react';
import { type AddBoardSchema, addBoardSchema, generateBoard } from '@/lib';
import { Label } from '@/components/ui/label';
import { useKanbanStore } from '@/store';

const [fieldName] = addBoardSchema.keyof().options;

const BoardAddDialog = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);

  const addBoard = useKanbanStore.use.addBoard();
  const { register, handleSubmit, reset, formState } = useForm<AddBoardSchema>({
    resolver: zodResolver(addBoardSchema),
  });

  const onSubmit: SubmitHandler<AddBoardSchema> = ({ title }) => {
    addBoard(generateBoard(title));
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <DialogHeader>
            <DialogTitle>새로운 보드 추가</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-7">
            <Label htmlFor={fieldName}>보드 이름</Label>
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

export { BoardAddDialog };
