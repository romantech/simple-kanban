'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { useKanbanStore } from '@/store';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { BoardEditDialogContent } from '@/components';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import { AlertDialogBaseContent } from '@/components/ui/alert-dialog-base-content';
import { type BoardId } from '@/schema';
import { useState } from 'react';

const HeaderDropdown = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const currentBoardId = useKanbanStore.use.currentBoardId();
  const boards = useKanbanStore.use.boards();
  const board = boards[currentBoardId];

  const disableDelete = Object.keys(boards).length <= 1;
  const deleteBoard = useKanbanStore.use.deleteBoard();

  const updateUrl = (boardId: BoardId, title: string) => {
    router.replace(`${boardId}?title=${title}`);
  };

  const onBoardDelete = () => {
    const { id: toBoardId, title: toBoardTitle } = deleteBoard(currentBoardId);
    updateUrl(toBoardId, toBoardTitle);
  };

  const onBoardEdit = (title: string) => {
    setOpen(false);
    updateUrl(board.id, title);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus-visible:rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            <DropdownMenuLabel>보드 관리</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DialogTrigger asChild>
                <DropdownMenuItem>보드 수정</DropdownMenuItem>
              </DialogTrigger>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem disabled={disableDelete}>보드 삭제</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <BoardEditDialogContent board={board} onEdit={onBoardEdit} />
        <AlertDialogBaseContent
          title="보드를 삭제할까요?"
          description="보드에 있는 모든 컬럼과 작업도 함께 삭제돼요."
          onConfirm={onBoardDelete}
        />
      </AlertDialog>
    </Dialog>
  );
};

export { HeaderDropdown };
