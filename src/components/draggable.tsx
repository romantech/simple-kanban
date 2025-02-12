'use client';

import { type PropsWithChildren } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const Draggable = ({ children, id }: PropsWithChildren<{ id: string }>) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <button
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
};

export { Draggable };
