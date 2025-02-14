'use client';

import { useDraggable } from '@dnd-kit/core';
import { type ElementType, type HTMLAttributes, type ReactNode } from 'react';

interface DraggableProps<T> extends HTMLAttributes<T> {
  children: ReactNode;
  id: string;
  element?: ElementType;
}

/**
 * @see https://docs.dndkit.com/api-documentation/draggable/drag-overlay#wrapper-nodes
 * */
const Draggable = <T extends ElementType = 'div'>({
  children,
  id,
  element,
  ...props
}: DraggableProps<T>) => {
  const Element = element ?? 'div';
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <Element ref={setNodeRef} {...attributes} {...listeners} {...props}>
      {children}
    </Element>
  );
};

export { Draggable };
