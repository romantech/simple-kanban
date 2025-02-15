'use client';

import { type DraggableAttributes, type UseDraggableArguments } from '@dnd-kit/core';
import { type CSSProperties, type ElementType, type ReactNode } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { DndPlaceholder, type DndPlaceholderVariantType } from '@/components/ui/dnd-placeholder';
import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface ChildrenProps {
  listeners?: SyntheticListenerMap;
  attributes: DraggableAttributes;
}

interface DraggableProps extends UseDraggableArguments {
  children: ({ listeners, attributes }: ChildrenProps) => ReactNode;
  attach?: Record<keyof ChildrenProps, boolean>;
  className?: string;
  type: DndPlaceholderVariantType;
  element?: ElementType;
}

/**
 * @see https://docs.dndkit.com/api-documentation/draggable/drag-overlay#wrapper-nodes
 * */
const Draggable = ({
  children,
  element,
  type,
  className,
  attach = { attributes: true, listeners: true },
  ...dragProps
}: DraggableProps) => {
  const Element = element ?? 'div';

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    ...dragProps,
    data: { ...dragProps.data, type },
  });

  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging) return <DndPlaceholder variant={type} style={style} ref={setNodeRef} />;

  const configProps = {
    ...(attach?.attributes && attributes),
    ...(attach?.listeners && listeners),
  };

  return (
    <Element ref={setNodeRef} className={className} style={style} {...configProps}>
      {children({ listeners, attributes })}
    </Element>
  );
};

export { Draggable };
