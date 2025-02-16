import { useKanbanStore } from '@/store';
import Image from 'next/image';

const KanbanHeader = () => {
  const title = useKanbanStore(({ boards, currentBoardId }) => boards[currentBoardId].title);

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
      <h2 className="p-6">{title}</h2>
    </header>
  );
};

export { KanbanHeader };
