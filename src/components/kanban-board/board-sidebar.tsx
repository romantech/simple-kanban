'use client';

import { useKanbanStore } from '@/store';
import { cn } from '@/lib';
import { ChevronsLeft, SquareKanban } from 'lucide-react';
import { BoardAddDialogContent } from '@/components';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const BoardSidebar = () => {
  const boards = useKanbanStore.use.boards();
  const currentBoardId = useKanbanStore.use.currentBoardId();

  const [openPanel, setOpenPanel] = useState(true);

  const toggleSidebar = () => setOpenPanel((prev) => !prev);

  return (
    <Fragment>
      <Sidebar
        className={cn('hidden lg:block', { 'w-0 invisible opacity-0 border-none p-0': !openPanel })}
      >
        <ul className="flex flex-col divide-y divide-baltic-900">
          {Object.values(boards).map(({ title, id }) => (
            <li
              key={id}
              className={cn(
                'font-semibold text-baltic-400 transition-all hover:text-charade-100 duration-300 truncate py-2 px-px',
                { 'text-charade-100 font-bold': id === currentBoardId },
              )}
            >
              <Link
                href={{ pathname: id, query: { title } }}
                className="block rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                prefetch
              >
                <SquareKanban className="inline size-[26px] pr-2" />
                {title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="sticky bottom-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full font-bold capitalize">add board</Button>
            </DialogTrigger>
            <BoardAddDialogContent />
          </Dialog>
        </div>
      </Sidebar>
      <button
        type="button"
        onClick={toggleSidebar}
        className={cn(
          'hidden h-[36px] px-2 bg-charade-950 lg:block transition-all duration-300 [&_svg]:size-[22px] absolute bottom-6 hover:bg-baltic-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          { 'translate-x-[288px] rounded-r-xl': openPanel, 'rotate-180 rounded-l-xl': !openPanel },
        )}
      >
        <ChevronsLeft />
      </button>
    </Fragment>
  );
};

export { BoardSidebar };
