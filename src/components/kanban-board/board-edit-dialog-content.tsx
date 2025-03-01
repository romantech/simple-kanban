'use client';

import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from '@/components/ui/button';
import { useKanbanStore } from '@/store';
import { addBoardSchema, type BoardDef } from '@/schema';
import { useRouter } from 'next/navigation';
import { BoardConfig, cn } from '@/lib';

interface BoardEditDialogProps {
  board: BoardDef;
  className?: string;
}

const editBoardSchema = addBoardSchema.omit({ preset: true });
type EditBoardSchema = z.infer<typeof editBoardSchema>;
const [titleField] = editBoardSchema.keyof().options;

export const BoardEditDialogContent = ({ board, className }: BoardEditDialogProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditBoardSchema>({
    resolver: zodResolver(editBoardSchema),
    defaultValues: { title: board.title },
  });

  const editBoard = useKanbanStore.use.editBoard();

  const onSubmit: SubmitHandler<EditBoardSchema> = ({ title }) => {
    editBoard(board.id, title);
    // 수정한 타이틀이 페이지 제목에 반영되도록 router.replace -> generateMetadata 함수로 title 전달
    router.replace(`/${board.id}?title=${title}`);
  };

  return (
    <DialogContent className={cn('sm:max-w-[425px]', className)}>
      <DialogHeader>
        <DialogTitle className="capitalize">보드 수정</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <div className="flex flex-col gap-2 py-4">
          <Label htmlFor={titleField}>보드 이름</Label>
          <Input
            {...register(titleField)}
            placeholder={`최대 ${BoardConfig.title.max}자까지 입력할 수 있어요`}
            maxLength={BoardConfig.title.max}
            minLength={BoardConfig.title.min}
          />
          <ErrorMessage
            errors={errors}
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
          <DialogClose asChild>
            <Button type="submit">수정</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
