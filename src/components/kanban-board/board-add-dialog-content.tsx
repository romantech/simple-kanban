'use client';

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { BoardConfig, cn, generateBoard } from '@/lib';
import { Label } from '@/components/ui/label';
import { useKanbanStore } from '@/store';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { addBoardSchema, type AddBoardSchema } from '@/schema';
import { useRouter } from 'next/navigation';

const [titleField, presetField] = addBoardSchema.keyof().options;
const resolver = zodResolver(addBoardSchema);
const defaultValues = { title: '', preset: true };

interface BoardAddDialogContentProps {
  className?: string;
}

const BoardAddDialogContent = ({ className }: BoardAddDialogContentProps) => {
  const router = useRouter();
  const addBoard = useKanbanStore.use.addBoard();

  const form = useForm<AddBoardSchema>({ resolver, defaultValues, shouldUnregister: true });

  const onSubmit: SubmitHandler<AddBoardSchema> = ({ title, preset }) => {
    const newBoard = generateBoard(title);
    addBoard(newBoard, preset);
    router.push(`/${newBoard.id}?title=${newBoard.title}`);
  };

  return (
    <DialogContent className={cn('sm:max-w-[425px]', className)}>
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
                    <FormDescription>진행 전, 진행 중, 완료 컬럼을 추가합니다.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit">추가</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export { BoardAddDialogContent };
