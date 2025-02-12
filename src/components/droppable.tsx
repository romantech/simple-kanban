'use client';

import { type PropsWithChildren } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

const Droppable = ({ children, id }: PropsWithChildren<{ id: string }>) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={cn({ 'bg-gray-200': isOver })}>
      {children}
    </div>
  );
};

export { Droppable };
