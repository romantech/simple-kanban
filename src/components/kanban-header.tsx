'use client';

import { useKanbanStore } from '@/store';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useState } from 'react';

const KanbanHeader = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const currentBoardId = useKanbanStore.use.currentBoardId();
  const title = useKanbanStore.use.boards()[currentBoardId].title;

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
      <div className="flex w-full items-center justify-between p-6">
        <h2>{title}</h2>
        <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
          <DropdownMenuTrigger>
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 font-semibold">
            <DropdownMenuItem disabled>보드 이름 변경(미구현)</DropdownMenuItem>
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
              <DropdownMenuItem disabled={shouldDisableDelete} onSelect={(e) => e.preventDefault()}>
                보드 삭제
              </DropdownMenuItem>
            </ConfirmDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export { KanbanHeader };
