import { Inbox } from 'lucide-react';
import { cn } from '@/lib';

type EmptyProps = React.HTMLAttributes<HTMLDivElement>;

const Empty = ({ className, ...divProps }: EmptyProps) => {
  return (
    <div
      className={cn(
        'size-full flex flex-col gap-4 items-center justify-center text-baltic-400',
        className,
      )}
      {...divProps}
    >
      <Inbox width={100} height={100} />
      <p className="text-xl font-bold capitalize">this board is empty</p>
    </div>
  );
};

export { Empty };
