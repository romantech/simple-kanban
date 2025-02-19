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
import { type BoardId, cn } from '@/lib';
import { useKanbanStore } from '@/store';
import { BoardAddDialog } from '@/components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const HeaderCommand = () => {
  const [openCommand, setOpenCommand] = useState(false);

  const currentBoardId = useKanbanStore.use.currentBoardId();
  const boards = useKanbanStore.use.boards();
  const board = boards[currentBoardId];

  const boardList = Object.values(boards);
  const router = useRouter();

  const onSearch = (boardId: string, term: string) => {
    // 검색어를 입력할 때마다 매칭 점수를 평가하기 위해 각 boardId에 대한 필터링이 독립적으로 실행됨
    const item = boards[boardId as BoardId];
    return item?.title.toLowerCase().includes(term.toLowerCase()) ? 1 : 0;
  };

  return (
    <Popover open={openCommand} onOpenChange={setOpenCommand}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full max-w-60 justify-between gap-x-0"
          aria-expanded={openCommand}
        >
          <span className="truncate">{board.title}</span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-full max-w-60 p-0">
        <Command filter={onSearch}>
          <CommandInput placeholder="보드 이름을 입력하세요" className="h-9" />
          <CommandList>
            <CommandEmpty>입력한 보드가 없어요</CommandEmpty>
            <CommandGroup className="p-2">
              {boardList.map(({ id, title }) => (
                <Link className="block" key={id} href={id} prefetch>
                  <CommandItem value={id} className="flex gap-2">
                    <Check className={cn('size-4', { 'opacity-0': id !== currentBoardId })} />
                    <span className="truncate">{title}</span>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          </CommandList>
          <BoardAddDialog onConfirm={({ id }) => router.push(id)}>
            <Button className="rounded-none font-bold capitalize lg:hidden">add board</Button>
          </BoardAddDialog>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { HeaderCommand };
