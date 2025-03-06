'use client';

import { useKanbanStore } from '@/store';
import { cn } from '@/lib';
import { ChevronsLeft, SquareKanban, SquarePlus } from 'lucide-react';
import { BoardAddDialogContent } from '@/components';
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
                'font-semibold text-baltic-400 transition-all hover:text-charade-100 duration-300 py-2 px-px',
                { 'text-charade-100 font-bold': id === currentBoardId },
              )}
            >
              <Link
                href={{ pathname: id, query: { title } }}
                className="flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
            <BoardAddDialogContent {...dialog} />
          </Dialog>
        </div>
      </Sidebar>
      <IconButton
        aria-label="사이드바 토글"
        tooltipContent="사이드바 토글"
        onClick={panel.toggle}
        Icon={ChevronsLeft}
        className={cn(
          'hidden h-[36px] px-2 bg-charade-950 lg:block transition-all duration-300 [&_svg]:size-[22px] absolute bottom-6 hover:bg-baltic-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-none shadow-md',
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
