import { addBoardSchema, type BoardFields } from '@/lib';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';
import { type z } from 'zod';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from '@/components/ui/button';
import { useKanbanStore } from '@/store';

interface BoardEditDialogProps {
  children: ReactNode;
  board: BoardFields;
}

const editBoardSchema = addBoardSchema.omit({ preset: true });
type EditBoardSchema = z.infer<typeof editBoardSchema>;
const [titleField] = editBoardSchema.keyof().options;

export const BoardEditDialog = ({ board, children }: BoardEditDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">보드 수정</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <div className="flex flex-col gap-2 py-5">
            <Label htmlFor={titleField}>보드 이름</Label>
            <Input {...register(titleField)} placeholder="최대 50자까지 입력할 수 있어요" />
            <ErrorMessage
              errors={errors}
              name={titleField}
              render={({ message }) => <p className="text-sm text-baltic-400">{message}</p>}
            />
          </div>
          <DialogFooter className="gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                취소
              </Button>
            </DialogClose>
            <Button type="submit">수정</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
