import { type HTMLAttributes } from 'react';
import { cn } from '@/lib';

export const Loader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex gap-4 *:size-6 *:progress *:bg-baltic-400', className)} {...props}>
      <div />
      <div />
      <div />
    </div>
  );
};
