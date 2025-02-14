import { type CSSProperties, type HTMLAttributes, type Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

const dndPlaceholderVariants = cva('rounded border-2 border-baltic-900', {
  variants: {
    variant: {
      column: 'w-64',
      task: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'column',
  },
});

type DivProps = HTMLAttributes<HTMLDivElement> & { ref: Ref<HTMLDivElement>; style: CSSProperties };
type DndPlaceholderProps = DivProps & VariantProps<typeof dndPlaceholderVariants>;

export const DndPlaceholder = ({ className, variant, ...divProps }: DndPlaceholderProps) => {
  return <div className={cn(dndPlaceholderVariants({ variant }), className)} {...divProps} />;
};
