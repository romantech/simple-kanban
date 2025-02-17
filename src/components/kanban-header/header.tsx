'use client';

import { useKanbanStore } from '@/store';
import Image from 'next/image';
import { SquarePlus } from 'lucide-react';
import { ColumnAddDialog } from '@/components/kanban-column';
import { HeaderCommand } from './header-command';
import { HeaderDropdown } from '@/components/kanban-header/header-dropdown';

const Header = () => {
  const board = useKanbanStore((state) => state.boards[state.currentBoardId]);

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
        <HeaderCommand />
        <div className="flex gap-4">
          <ColumnAddDialog boardId={board.id}>
            <button className="text-charade-200 transition-all hover:bg-baltic-900/50 active:scale-95 lg:hidden">
              <SquarePlus className="size-6" />
            </button>
          </ColumnAddDialog>
          <HeaderDropdown />
        </div>
      </nav>
    </header>
  );
};

export { Header };
