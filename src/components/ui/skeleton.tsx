import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';
import { Loader } from '@/components/ui/loader';

export const Skeleton = () => {
  return (
    <div className="flex size-full flex-col">
      <Header>
        <h1 className="block text-3xl lg:hidden">kanban</h1>
      </Header>
      <div className="flex min-h-0 flex-1">
        <Sidebar className="hidden lg:block" />
        <div className="grid size-full place-content-center">
          <Loader />
        </div>
      </div>
    </div>
  );
};
