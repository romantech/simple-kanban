import { Inbox } from 'lucide-react';
import { cn } from '@/lib';
import { motion } from 'motion/react';
import { type ComponentProps, type ReactNode } from 'react';

interface EmptyProps extends ComponentProps<typeof motion.div> {
  children?: ReactNode;
}

const Empty = ({ className, children, ...divProps }: EmptyProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'size-full flex flex-col gap-4 items-center justify-center text-baltic-400',
        className,
      )}
      {...divProps}
    >
      <Inbox width={100} height={100} />
      {children}
    </motion.div>
  );
};

export { Empty };
