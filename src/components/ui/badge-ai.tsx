import { type ComponentProps } from 'react';
import { cn } from '@/lib';

export const BadgeAI = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'absolute -right-2 -top-2.5 size-5 rounded-full bg-charade-100 text-xs font-semibold leading-5 text-charade-950',
        className,
      )}
      {...props}
    >
      AI
    </div>
  );
};
