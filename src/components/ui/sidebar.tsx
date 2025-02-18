import type { PropsWithChildren } from 'react';

const Sidebar = ({ children, title = 'all boards' }: PropsWithChildren<{ title?: string }>) => {
  return (
    <div className="scroll-custom invisible w-0 max-w-72 space-y-4 overflow-y-auto border-r border-baltic-900 bg-charade-950 p-0 opacity-0 transition-all lg:visible lg:block lg:w-full lg:p-6 lg:opacity-100">
      <h3 className="text-sm font-bold uppercase text-baltic-400">{title}</h3>
      {children}
    </div>
  );
};

export { Sidebar };
