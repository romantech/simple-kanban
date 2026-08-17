'use client';

import { useKanbanStore } from '@/store';
import { cn } from '@/lib';
import { ChevronsLeft, SquareKanban, SquarePlus } from 'lucide-react';
import { BoardAddDialogContent } from '@/components/kanban-board';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Fragment } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';
import { useDisclosure } from '@/hooks';

const BoardSidebar = () => {
  const boards = useKanbanStore.use.boards();
  const currentBoardId = useKanbanStore.use.currentBoardId();

  const dialog = useDisclosure();
  const panel = useDisclosure(true);

  return (
    <Fragment>
      <Sidebar
        className={cn('hidden lg:block', {
          'w-0 invisible opacity-0 border-none p-0': !panel.open,
        })}
      >
        <ul className="flex flex-col divide-y divide-baltic-900">
          {Object.values(boards).map(({ title, id }) => (
            <li
              key={id}
              className={cn(
                'px-px py-2 font-semibold text-baltic-400 transition-all duration-300 hover:text-charade-100',
                { 'text-charade-100 font-bold': id === currentBoardId },
              )}
            >
              <Link
                href={{ pathname: id, query: { title } }}
                className="flex items-center gap-2 rounded focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
                prefetch
              >
                <SquareKanban className="size-[18px] shrink-0" />
                <span className="truncate">{title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="sticky bottom-0">
          <Dialog {...dialog}>
            <DialogTrigger asChild>
              <Button className="w-full font-bold capitalize">
                <SquarePlus />
                보드 추가
              </Button>
            </DialogTrigger>
            <BoardAddDialogContent />
          </Dialog>
        </div>
      </Sidebar>
      <IconButton
        aria-label="사이드바 토글"
        tooltipContent="사이드바 토글"
        onClick={panel.toggle}
        Icon={ChevronsLeft}
        className={cn(
          'absolute bottom-6 hidden h-9 rounded-none bg-charade-950 px-2 shadow-md transition-all duration-300 hover:bg-baltic-900 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden lg:block [&_svg]:size-[22px]',
          {
            'translate-x-[288px] rounded-r-xl': panel.open,
            'rotate-180 rounded-l-xl': !panel.open,
          },
        )}
      />
    </Fragment>
  );
};

export { BoardSidebar };
