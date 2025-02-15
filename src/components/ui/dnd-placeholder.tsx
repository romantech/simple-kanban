import { type CSSProperties, type HTMLAttributes, type Ref } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

const dndPlaceholderVariants = cva('rounded border-2 border-baltic-900', {
  variants: {
    variant: {
      column: 'w-72',
      task: 'h-[74.5px]',
    },
  },
  defaultVariants: {
    variant: 'column',
  },
});

type DndPlaceholderVariants = VariantProps<typeof dndPlaceholderVariants>;
type DndPlaceholderVariantType = DndPlaceholderVariants['variant'];

type DivProps = HTMLAttributes<HTMLDivElement> & { ref: Ref<HTMLDivElement>; style: CSSProperties };
type DndPlaceholderProps = DivProps & DndPlaceholderVariants;

const DndPlaceholder = ({ className, variant, ...divProps }: DndPlaceholderProps) => {
  return <div className={cn(dndPlaceholderVariants({ variant }), className)} {...divProps} />;
};

export { DndPlaceholder, type DndPlaceholderVariantType };
