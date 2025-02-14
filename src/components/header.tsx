import { useKanbanStore } from '@/store';
import Image from 'next/image';

const Header = () => {
  const title = useKanbanStore(({ boards, currentBoardId }) => boards[currentBoardId].title);

  return (
    <header className="flex h-[85px] items-center border-b border-baltic-900 bg-charade-950 text-2xl font-extrabold">
      <div className="flex h-full min-w-72 items-center border-r border-baltic-900 bg-charade-950 px-6">
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

export { Header };
