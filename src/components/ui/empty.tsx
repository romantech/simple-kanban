import { Inbox } from 'lucide-react';
import { cn } from '@/lib';
import { motion } from 'motion/react';
import { type ComponentProps } from 'react';

const Empty = ({ className, ...divProps }: ComponentProps<typeof motion.div>) => {
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
      <p className="text-xl font-bold capitalize">this board is empty</p>
    </motion.div>
  );
};

export { Empty };
