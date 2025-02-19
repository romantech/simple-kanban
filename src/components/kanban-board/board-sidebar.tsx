'use client';

import { useKanbanStore } from '@/store';
import { cn } from '@/lib';
import { SquareKanban } from 'lucide-react';
import { BoardAddDialog } from '@/components';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BoardSidebar = () => {
  const boards = useKanbanStore.use.boards();
  const currentBoardId = useKanbanStore.use.currentBoardId();
  const router = useRouter();

  return (
    <Sidebar>
      <ul className="flex flex-col divide-y divide-baltic-900">
        {Object.values(boards).map((board) => (
          <li
            key={board.id}
            className={cn(
              'font-semibold text-baltic-400 transition-all hover:text-charade-100 duration-300 truncate py-2',
              { 'text-charade-100 font-bold': board.id === currentBoardId },
            )}
          >
            <Link href={board.id} className="block">
              <SquareKanban className="inline size-[26px] pr-2" />
              {board.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="sticky bottom-0">
        <BoardAddDialog onConfirm={({ id }) => router.push(id)}>
          <Button className="w-full font-bold capitalize">add board</Button>
        </BoardAddDialog>
      </div>
    </Sidebar>
  );
};

export { BoardSidebar };
