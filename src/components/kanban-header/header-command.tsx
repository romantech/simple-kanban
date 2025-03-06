'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, SquarePlus } from 'lucide-react';
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
import { type BoardId } from '@/schema';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useDisclosure } from '@/hooks';
import { useRouter } from 'next/navigation';

const HeaderCommand = () => {
  const router = useRouter();

  const command = useDisclosure();
  const dialog = useDisclosure();

  const currentBoardId = useKanbanStore.use.currentBoardId();
  const boards = useKanbanStore.use.boards();

  const board = boards[currentBoardId];
  const boardList = Object.values(boards);

  const onSearch = (boardId: string, term: string) => {
    // 검색어를 입력할 때마다 매칭 점수를 평가하기 위해 각 boardId에 대한 필터링이 독립적으로 실행됨
    const item = boards[boardId as BoardId];
    return item?.title.toLowerCase().includes(term.toLowerCase()) ? 1 : 0;
  };

  const onSelect = (boardId: string, title: string) => {
    router.push(`/${boardId}?title=${title}`);
  };

  return (
    <Dialog {...dialog}>
      <Popover {...command}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-label={`현재 보드: ${board.title}. 클릭하여 보드 선택`}
            aria-expanded={command.open}
            aria-controls="board-selector"
            className="w-full max-w-44 justify-between gap-x-0 sm:max-w-60"
          >
            <span className="truncate">{board.title}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-full max-w-44 p-0 sm:max-w-60"
          id="board-selector"
          role="dialog"
          aria-label="보드 선택 메뉴"
        >
          <Command filter={onSearch}>
            <CommandInput
              placeholder="보드 이름을 입력하세요"
              className="h-9"
              aria-label="보드 검색"
            />
            <CommandList>
              <CommandEmpty>
                <span role="status">입력한 보드가 없어요</span>
              </CommandEmpty>
              <CommandGroup className="p-2" aria-label="사용 가능한 보드 목록">
                {boardList.map(({ id, title }) => {
                  const isSelected = id === currentBoardId;
                  return (
                    <CommandItem
                      key={id}
                      value={id}
                      className="flex h-9 gap-2"
                      onSelect={(boardId) => onSelect(boardId, title)}
                      aria-selected={isSelected}
                      aria-label={`${title}${isSelected ? ' (현재 선택됨)' : ''}`}
                    >
                      <Check
                        className={cn('size-4', { 'opacity-0': id !== currentBoardId })}
                        aria-hidden="true"
                      />
                      <span className="truncate">{title}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <DialogTrigger asChild>
              <Button className="m-2 font-bold capitalize lg:hidden" aria-label="새로운 보드 추가">
                <SquarePlus aria-hidden="true" />
                보드 추가
              </Button>
            </DialogTrigger>
          </Command>
        </PopoverContent>
      </Popover>
      <BoardAddDialogContent {...dialog} />
    </Dialog>
  );
};

export { HeaderCommand };
