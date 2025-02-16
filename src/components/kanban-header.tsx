'use client';

import { useKanbanStore } from '@/store';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Check, ChevronsUpDown, EllipsisVertical, SquarePlus } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useState } from 'react';
import { ColumnAddDialog } from '@/components/kanban-column';
import { Button } from '@/components/ui/button';
import { type BoardId, cn } from '@/lib';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { toBoardId } from '@/types';

const KanbanHeader = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openCommand, setOpenCommand] = useState(false);

  const setCurrentBoard = useKanbanStore.use.setCurrentBoard();
  const currentBoardId = useKanbanStore.use.currentBoardId();
  const boards = useKanbanStore.use.boards();
  const board = boards[currentBoardId];

  const deleteBoard = useKanbanStore.use.deleteBoard();
  const getBoardCount = useKanbanStore.use.getBoardCount();

  const shouldDisableDelete = getBoardCount() <= 1;

  const boardList = Object.values(boards);

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
        <Popover open={openCommand} onOpenChange={setOpenCommand}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full max-w-60 justify-between"
              aria-expanded={openCommand}
            >
              {board.title}
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full max-w-60 p-0">
            <Command
              filter={(boardId, term) => {
                // 검색어를 입력할 때마다 매칭 점수를 평가하기 각 boardId에 대한 필터링이 독립적으로 실행됨
                const item = boards[boardId as BoardId];
                return item.title.toLowerCase().includes(term.toLowerCase()) ? 1 : 0;
              }}
            >
              <CommandInput placeholder="보드 이름을 입력하세요" className="h-9" />
              <CommandList>
                <CommandEmpty>입력한 보드가 없어요</CommandEmpty>
                <CommandGroup className="p-2">
                  {boardList.map(({ id, title }) => (
                    <CommandItem
                      key={id}
                      value={id}
                      onSelect={(selectedId) => {
                        setCurrentBoard(toBoardId(selectedId));
                        setOpenCommand(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 size-4',
                          currentBoardId === id ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export { KanbanHeader };
