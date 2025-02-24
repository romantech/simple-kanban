'use client';

import { useKanbanStore } from '@/store';
import { Github, SquarePlus } from 'lucide-react';
import { ColumnAddDialog, HeaderCommand, HeaderDropdown } from '@/components';
import { Header } from '@/components/ui/header';

const HeaderNav = () => {
  const board = useKanbanStore((state) => state.boards[state.currentBoardId]);

  return (
    <Header>
      <nav className="flex w-full items-center justify-between lg:p-6">
        <HeaderCommand />
        <div className="flex gap-4">
          <ColumnAddDialog boardId={board.id}>
            <button className="text-charade-200 transition-all hover:bg-baltic-900/50 active:scale-95 lg:hidden">
              <SquarePlus className="size-6" />
            </button>
          </ColumnAddDialog>
          <a
            href="https://github.com/romantech/simple-kanban"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block"
            title="GitHub Repository"
          >
            <Github />
          </a>
          <HeaderDropdown />
        </div>
      </nav>
    </Header>
  );
};

export { HeaderNav };
