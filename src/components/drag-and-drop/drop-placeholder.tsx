import { type CSSProperties, type HTMLAttributes, type Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

const dropPlaceholderVariants = cva('rounded border-2 border-baltic-900', {
  variants: {
    variant: {
      column: 'min-w-72',
      task: 'min-h-[90px]',
      subtask: 'min-h-[46px]',
    },
  },
  defaultVariants: {
    variant: 'column',
  },
});

type DndPlaceholderVariants = VariantProps<typeof dropPlaceholderVariants>;

type DivProps = HTMLAttributes<HTMLDivElement> & { ref: Ref<HTMLDivElement>; style: CSSProperties };
type DndPlaceholderProps = DivProps & DndPlaceholderVariants;

export const DropPlaceholder = ({ className, variant, ...divProps }: DndPlaceholderProps) => {
  return <div className={cn(dropPlaceholderVariants({ variant }), className)} {...divProps} />;
};
