'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib';
import { useKanbanStore } from '@/store';
import { BoardAddDialogContent } from '@/components';
import Link from 'next/link';
import { type BoardId } from '@/schema';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const HeaderCommand = () => {
  const [openCommand, setOpenCommand] = useState(false);

  const currentBoardId = useKanbanStore.use.currentBoardId();
  const boards = useKanbanStore.use.boards();
  const board = boards[currentBoardId];

  const boardList = Object.values(boards);

  const onSearch = (boardId: string, term: string) => {
    // 검색어를 입력할 때마다 매칭 점수를 평가하기 위해 각 boardId에 대한 필터링이 독립적으로 실행됨
    const item = boards[boardId as BoardId];
    return item?.title.toLowerCase().includes(term.toLowerCase()) ? 1 : 0;
  };

  return (
    <Dialog>
      <Popover open={openCommand} onOpenChange={setOpenCommand}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full max-w-44 justify-between gap-x-0 sm:max-w-60"
            aria-expanded={openCommand}
          >
            <span className="truncate">{board.title}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-full max-w-44 p-0 sm:max-w-60">
          <Command filter={onSearch}>
            <CommandInput placeholder="보드 이름을 입력하세요" className="h-9" />
            <CommandList>
              <CommandEmpty>입력한 보드가 없어요</CommandEmpty>
              <CommandGroup className="p-2">
                {boardList.map(({ id, title }) => (
                  <Link
                    className="block py-px focus-visible:rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    key={id}
                    href={{ pathname: id, query: { title } }}
                    prefetch
                  >
                    <CommandItem value={id} className="flex gap-2">
                      <Check className={cn('size-4', { 'opacity-0': id !== currentBoardId })} />
                      <span className="truncate">{title}</span>
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            </CommandList>
            <DialogTrigger asChild>
              <Button className="m-2 font-bold capitalize lg:hidden">보드 추가</Button>
            </DialogTrigger>
          </Command>
        </PopoverContent>
      </Popover>
      <BoardAddDialogContent />
    </Dialog>
  );
};

export { HeaderCommand };
