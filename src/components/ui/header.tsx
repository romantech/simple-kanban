import type { PropsWithChildren } from 'react';
import { Logo } from '@/components/ui/logo';

const Header = ({ children }: PropsWithChildren) => {
  return (
    <header className="flex h-[85px] items-center border-b border-baltic-900 bg-charade-950 p-4 font-extrabold lg:p-0">
      <div className="flex h-full items-center lg:min-w-72 lg:border-r lg:px-6">
        <Logo className="mr-4" />
        <h1 className="hidden text-4xl lg:block">kanban</h1>
      </div>
      {children}
    </header>
  );
};

export { Header };
