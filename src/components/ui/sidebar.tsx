import type { HTMLAttributes } from 'react';
import { cn } from '@/lib';

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

const Sidebar = ({ children, title = 'all boards', className, ...divProps }: SidebarProps) => {
  return (
    <div
      className={cn(
        'scroll-custom w-full max-w-72 space-y-4 overflow-y-auto border-r border-baltic-900 bg-charade-950 p-6 transition-all duration-300',
        className,
      )}
      {...divProps}
    >
      <h2 className="text-sm font-bold text-baltic-400 uppercase">{title}</h2>
      {children}
    </div>
  );
};

export { Sidebar };
