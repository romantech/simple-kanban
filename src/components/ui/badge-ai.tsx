import { type ComponentProps } from 'react';
import { cn } from '@/lib';

interface BadgeAIProps extends ComponentProps<'div'> {
  size?: string;
}

export const BadgeAI = ({ className, size = '1.25rem', ...props }: BadgeAIProps) => {
  return (
    <div
      className={cn(
        'absolute -top-2.5 -right-2 inline-block rounded-full bg-charade-100 text-center text-xs font-semibold text-charade-950 select-none',
        className,
      )}
      style={{ width: size, height: size, lineHeight: size }}
      {...props}
    >
      AI
    </div>
  );
};
