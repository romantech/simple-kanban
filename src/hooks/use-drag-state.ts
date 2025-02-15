import { useCallback, useState } from 'react';
import { type UniqueIdentifier } from '@dnd-kit/core';

const useDragState = () => {
  const [dragColumnId, setDragColumnId] = useState<UniqueIdentifier>();
  const [dragTaskId, setDragTaskId] = useState<UniqueIdentifier>();

  const resetDragState = useCallback(() => {
    setDragColumnId(undefined);
    setDragTaskId(undefined);
  }, []);

  const setDragState = useCallback((type: 'task' | 'column', value: UniqueIdentifier) => {
    const setStateMap = { task: setDragTaskId, column: setDragColumnId };
    setStateMap[type](value);
  }, []);

  return { dragColumnId, setDragState, dragTaskId, resetDragState };
};

export { useDragState };
