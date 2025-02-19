import { type HTMLAttributes } from 'react';
import { cn } from '@/lib';

export const Loader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('*:progress *:size-8 *:bg-baltic-400 flex gap-4', className)} {...props}>
      <div />
      <div />
      <div />
    </div>
  );
};
