import { useKanbanStore } from '@/store';
import Image from 'next/image';

const Header = () => {
  const title = useKanbanStore((state) => state.getBoard().title);

  return (
    <header className="flex h-[85px] items-center border-b border-line bg-haiti text-2xl font-extrabold">
      <div className="flex h-full min-w-72 items-center border-r border-line bg-haiti px-6">
        <Image src="logo-light.svg" alt="logo" width={160} height={80} />
      </div>
      <h2 className="p-6">{title}</h2>
    </header>
  );
};

export { Header };
