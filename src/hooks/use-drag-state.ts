import { useCallback, useState } from 'react';
import { type UniqueIdentifier } from '@dnd-kit/core';

const useDragState = <T extends UniqueIdentifier>() => {
  const [dragColumnId, setDragColumnId] = useState<T>();
  const [dragTaskId, setDragTaskId] = useState<T>();

  const resetDragState = useCallback(() => {
    setDragColumnId(undefined);
    setDragTaskId(undefined);
  }, []);

  const setDragState = useCallback((type: 'task' | 'column', value: T) => {
    const setStateMap = { task: setDragTaskId, column: setDragColumnId };
    setStateMap[type](value);
  }, []);

  return { dragColumnId, setDragState, dragTaskId, resetDragState };
};

export { useDragState };
