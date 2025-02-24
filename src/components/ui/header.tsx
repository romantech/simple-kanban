import type { PropsWithChildren } from 'react';
import { Logo } from '@/components/ui/logo';

const Header = ({ children }: PropsWithChildren) => {
  return (
    <header className="flex h-[85px] items-center border-b border-baltic-900 bg-charade-950 text-xl font-extrabold lg:text-2xl">
      <div className="hidden h-full min-w-72 items-center gap-4 border-r border-baltic-900 bg-charade-950 px-6 lg:flex">
        <Logo />
        <h1 className="text-4xl">kanban</h1>
      </div>
      {children}
    </header>
  );
};

export { Header };
