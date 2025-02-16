'use client';

import { type DraggableAttributes, type UseDraggableArguments } from '@dnd-kit/core';
import { type CSSProperties, type ElementType, type ReactNode } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import {
  type DndPlaceholderVariantType,
  DropPlaceholder,
} from '@/components/drag-and-drop/drop-placeholder';
import { type SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface ChildrenProps {
  listeners?: SyntheticListenerMap;
  attributes: DraggableAttributes;
}

interface DraggableProps extends UseDraggableArguments {
  children: ({ listeners, attributes }: ChildrenProps) => ReactNode;
  rootDndConfig?: Record<keyof ChildrenProps, boolean>;
  className?: string;
  type: DndPlaceholderVariantType;
  element?: ElementType;
}

/**
 * @see https://docs.dndkit.com/api-documentation/draggable/drag-overlay#wrapper-nodes
 * 공식 문서에서 제공한 코드를 기반으로 listeners, attributes 를 자유롭게 배치할 수 있도록 render prop 형태로 구현
 * */
const Draggable = ({
  children,
  element,
  type,
  className,
  rootDndConfig = { attributes: true, listeners: true },
  ...dragProps
}: DraggableProps) => {
  const Element = element ?? 'div';

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    ...dragProps,
    data: { ...dragProps.data, type },
  });

  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging) return <DropPlaceholder variant={type} style={style} ref={setNodeRef} />;

  const configProps = {
    ...(rootDndConfig?.attributes && attributes),
    ...(rootDndConfig?.listeners && listeners),
  };

  return (
    <Element ref={setNodeRef} className={className} style={style} {...configProps}>
      {children({ listeners, attributes })}
    </Element>
  );
};

export { Draggable };
