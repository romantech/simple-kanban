import { useCallback, useReducer } from 'react';
import { type UniqueIdentifier } from '@dnd-kit/core';

export type DragType = 'task' | 'subtask' | 'column';
type DragId = UniqueIdentifier | null;
type DragIds = Record<DragType, DragId>;

interface SetDragAction {
  type: 'SET';
  dragType: DragType;
  value: DragId;
}

interface ResetDragAction {
  type: 'RESET';
}

type DragAction = SetDragAction | ResetDragAction;
const INITIAL_DRAG_IDS: DragIds = { column: null, task: null, subtask: null };

const dragIdsReducer = (state: DragIds, action: DragAction): DragIds => {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.dragType]: action.value };
    case 'RESET':
      return INITIAL_DRAG_IDS;
    default:
      return state;
  }
};
export const useDragIds = () => {
  const [dragIds, dispatch] = useReducer(dragIdsReducer, INITIAL_DRAG_IDS);

  const resetDragIds = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const setDragIds = useCallback((dragType: DragType, value: DragId) => {
    dispatch({ type: 'SET', dragType, value });
  }, []);

  return { dragIds, setDragIds, resetDragIds };
};
