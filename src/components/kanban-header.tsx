'use client';

import { useKanbanStore } from '@/store';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { EllipsisVertical, SquarePlus } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useState } from 'react';
import { ColumnAddDialog } from '@/components/kanban-column';
import { BoardCommand } from './kanban-board';

const KanbanHeader = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const setCurrentBoard = useKanbanStore.use.setCurrentBoard();
  const currentBoardId = useKanbanStore.use.currentBoardId();
  const boards = useKanbanStore.use.boards();
  const board = boards[currentBoardId];

  const deleteBoard = useKanbanStore.use.deleteBoard();
  const getBoardCount = useKanbanStore.use.getBoardCount();

  const shouldDisableDelete = getBoardCount() <= 1;

  return (
    <header className="flex h-[85px] items-center border-b border-baltic-900 bg-charade-950 text-xl font-extrabold lg:text-2xl">
      <div className="hidden h-full min-w-72 items-center border-r border-baltic-900 bg-charade-950 px-6 lg:flex">
        <Image
          priority
          src="logo-light.svg"
          alt="logo"
          width={153}
          height={26}
          className="size-auto"
        />
      </div>
      <nav className="flex w-full items-center justify-between p-6">
        <BoardCommand
          currentBoardId={currentBoardId}
          setCurrentBoard={setCurrentBoard}
          boards={boards}
        />
        <div className="flex gap-4">
          <ColumnAddDialog boardId={board.id}>
            <button className="text-charade-200 transition-all hover:bg-baltic-900/50 active:scale-95 lg:hidden">
              <SquarePlus className="size-6" />
            </button>
          </ColumnAddDialog>
          <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
            <DropdownMenuTrigger>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 font-semibold">
              <DropdownMenuLabel>보드 관리</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>보드 수정 (미구현)</DropdownMenuItem>
                <ConfirmDialog
                  disabled={shouldDisableDelete}
                  title="보드를 삭제할까요?"
                  description="보드에 있는 모든 컬럼과 작업들도 삭제돼요"
                  onConfirm={() => {
                    deleteBoard(currentBoardId);
                    setOpenMenu(false);
                  }}
                  onCancel={() => setOpenMenu(false)}
                >
                  <DropdownMenuItem
                    disabled={shouldDisableDelete}
                    onSelect={(e) => e.preventDefault()}
                  >
                    보드 삭제
                  </DropdownMenuItem>
                </ConfirmDialog>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export { KanbanHeader };
