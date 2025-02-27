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
import { BoardConfig, generateBoard } from '@/lib';
import { Label } from '@/components/ui/label';
import { useKanbanStore } from '@/store';
import { type Void } from '@/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { addBoardSchema, type AddBoardSchema, type BoardDef } from '@/schema';

const [titleField, presetField] = addBoardSchema.keyof().options;

interface BoardAddDialogProps {
  onConfirm?: Void<[BoardDef]>;
  children: ReactNode;
}

const BoardAddDialog = ({ children, onConfirm }: BoardAddDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addBoard = useKanbanStore.use.addBoard();
  const form = useForm<AddBoardSchema>({
    resolver: zodResolver(addBoardSchema),
    defaultValues: { title: '', preset: true },
  });

  const onSubmit: SubmitHandler<AddBoardSchema> = ({ title, preset }) => {
    const newBoard = generateBoard(title);
    addBoard(newBoard, preset);
    form.reset();
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
        <Form {...form}>
          <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
            <DialogHeader>
              <DialogTitle>새로운 보드 추가</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-5 py-7">
              <div className="flex flex-col gap-2">
                <Label htmlFor={titleField}>보드 이름</Label>
                <Input
                  {...form.register(titleField)}
                  placeholder={`최대 ${BoardConfig.title.max}자까지 입력할 수 있어요`}
                  maxLength={BoardConfig.title.max}
                  minLength={BoardConfig.title.min}
                />
                <ErrorMessage
                  errors={form.formState.errors}
                  name={titleField}
                  render={({ message }) => <p className="text-sm text-baltic-400">{message}</p>}
                />
              </div>
              <FormField
                control={form.control}
                name={presetField}
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-2 leading-none">
                      <FormLabel>기본 컬럼 자동 추가</FormLabel>
                      <FormDescription>
                        체크하면 진행 전, 진행 중, 완료 컬럼이 자동 추가됩니다.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { BoardAddDialog };
