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
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { type PropsWithChildren } from 'react';
import { ColumnConfig, generateColumn } from '@/lib';
import { Label } from '@/components/ui/label';
import { addColumnSchema, type AddColumnSchema } from '@/schema';
import { useDisclosure } from '@/hooks';

const [titleField] = addColumnSchema.keyof().options;

const ColumnAddDialog = ({ children }: PropsWithChildren) => {
  const dialog = useDisclosure();

  const { register, handleSubmit, formState } = useForm<AddColumnSchema>({
    resolver: zodResolver(addColumnSchema),
    shouldUnregister: true,
  });

  const addColumn = useKanbanStore.use.addColumn();
  const boardId = useKanbanStore.use.currentBoardId();

  const onSubmit: SubmitHandler<AddColumnSchema> = ({ title }) => {
    addColumn(generateColumn(boardId, title));
    dialog.onOpenChange(false);
  };

  return (
    <Dialog {...dialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <DialogHeader>
            <DialogTitle>새로운 컬럼 추가</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-7">
            <Label htmlFor={titleField}>컬럼 이름</Label>
            <Input
              {...register(titleField)}
              placeholder={`최대 ${ColumnConfig.title.max}자까지 입력할 수 있어요`}
              maxLength={ColumnConfig.title.max}
              minLength={ColumnConfig.title.min}
            />
            <ErrorMessage
              errors={formState.errors}
              name={titleField}
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

export { ColumnAddDialog };
