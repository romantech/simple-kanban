import { Header } from '@/components/ui/header';
import { Sidebar } from '@/components/ui/sidebar';
import { LoaderCircle } from 'lucide-react';

export const Skeleton = () => {
  return (
    <div className="flex size-full flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <div className="grid size-full place-content-center">
          <LoaderCircle width={100} height={100} className="animate-spin" />
        </div>
      </div>
    </div>
  );
};
