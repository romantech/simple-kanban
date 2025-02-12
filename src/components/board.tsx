'use client';

import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { Draggable } from '@/components/draggable';
import { Droppable } from '@/components/droppable';
import { useState } from 'react';

const containers = ['A', 'B', 'C'];

const Markup = () => <Draggable id="draggable">Drag me</Draggable>;

const Board = () => {
  const [parent, setParent] = useState<string | null>(null);

  const handleDragEnd = ({ over, active }: DragEndEvent) => {
    console.log(active);
    setParent(over ? `${over.id}` : null);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? <Markup /> : null}
      {containers.map((id) => (
        <Droppable id={id} key={id}>
          {parent === id ? <Markup /> : 'Drop here'}
        </Droppable>
      ))}
    </DndContext>
  );
};
export { Board };
