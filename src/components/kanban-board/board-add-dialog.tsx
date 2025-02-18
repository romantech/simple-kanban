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
import { type ReactNode, useState } from 'react';
import { type AddBoardSchema, addBoardSchema, type BoardFields, generateBoard } from '@/lib';
import { Label } from '@/components/ui/label';
import { useKanbanStore } from '@/store';
import { type Void } from '@/types';

const [fieldName] = addBoardSchema.keyof().options;

interface BoardAddDialogProps {
  onConfirm?: Void<[BoardFields]>;
  children: ReactNode;
}

const BoardAddDialog = ({ children, onConfirm }: BoardAddDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addBoard = useKanbanStore.use.addBoard();
  const { register, handleSubmit, reset, formState } = useForm<AddBoardSchema>({
    resolver: zodResolver(addBoardSchema),
  });

  const onSubmit: SubmitHandler<AddBoardSchema> = ({ title }) => {
    const newBoard = generateBoard(title);
    addBoard(newBoard);
    reset();
    setIsDialogOpen(false);
    onConfirm?.(newBoard);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onKeyDown={(e) => {
          // Dialog 컴포넌트에서 엔터 누르면 Command 컴포넌트의 onSelect 핸들러 실행되는 문제 해결
          if (e.key === 'Enter') e.stopPropagation();
        }}
      >
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
          <DialogFooter className="gap-3">
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
