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
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useState } from 'react';
import { useKanbanStore } from '@/store';
import { useRouter } from 'next/navigation';
import { BoardEditDialog } from '@/components';

const HeaderDropdown = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const router = useRouter();

  const currentBoardId = useKanbanStore.use.currentBoardId();
  const boards = useKanbanStore.use.boards();
  const board = boards[currentBoardId];

  const boardCount = Object.keys(boards).length;
  const deleteBoard = useKanbanStore.use.deleteBoard();
  const shouldDisableDelete = boardCount <= 1;

  const onConfirmDelete = () => {
    const { id, title } = deleteBoard(currentBoardId);
    setOpenMenu(false);
    router.replace(`${id}?title=${title}`);
  };

  return (
    <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2">
        <DropdownMenuLabel>보드 관리</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <BoardEditDialog board={board}>보드 수정</BoardEditDialog>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={shouldDisableDelete} onSelect={(e) => e.preventDefault()}>
            <ConfirmDialog
              disabled={shouldDisableDelete}
              title="보드를 삭제할까요?"
              description="보드에 있는 모든 컬럼과 작업들도 삭제돼요"
              onConfirm={onConfirmDelete}
            >
              보드 삭제
            </ConfirmDialog>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { HeaderDropdown };
