'use client';

import { useDraggable, type UseDraggableArguments } from '@dnd-kit/core';
import { type ElementType, type ReactNode } from 'react';

interface DraggableProps extends UseDraggableArguments {
  children: ReactNode;
  className?: string;
  element?: ElementType;
}

/**
 * @see https://docs.dndkit.com/api-documentation/draggable/drag-overlay#wrapper-nodes
 * */
const Draggable = ({ children, element, className, ...dragProps }: DraggableProps) => {
  const Element = element ?? 'div';
  const { attributes, listeners, setNodeRef } = useDraggable(dragProps);

  return (
    <Element ref={setNodeRef} {...attributes} {...listeners} className={className}>
      {children}
    </Element>
  );
};

export { Draggable };
