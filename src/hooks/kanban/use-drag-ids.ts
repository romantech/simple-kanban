'use client';

import { useCallback, useReducer } from 'react';
import { type UniqueIdentifier } from '@dnd-kit/core';

export type DragType = 'task' | 'subtask' | 'column';
type DragId = UniqueIdentifier | null;
type DragIds = Record<DragType, DragId>;
enum DragActionType {
  Set,
  Reset,
}

interface SetDragAction {
  type: DragActionType.Set;
  dragType: DragType;
  value: DragId;
}

interface ResetDragAction {
  type: DragActionType.Reset;
}

type DragAction = SetDragAction | ResetDragAction;
const INITIAL_DRAG_IDS: DragIds = { column: null, task: null, subtask: null };

const dragIdsReducer = (state: DragIds, action: DragAction): DragIds => {
  switch (action.type) {
    case DragActionType.Set:
      return { ...state, [action.dragType]: action.value };
    case DragActionType.Reset:
      return INITIAL_DRAG_IDS;
    default:
      return state;
  }
};
export const useDragIds = () => {
  const [dragIds, dispatch] = useReducer(dragIdsReducer, INITIAL_DRAG_IDS);

  const resetDragIds = useCallback(() => {
    dispatch({ type: DragActionType.Reset });
  }, []);

  const setDragIds = useCallback((dragType: DragType, value: DragId) => {
    dispatch({ type: DragActionType.Set, dragType, value });
  }, []);

  return { dragIds, setDragIds, resetDragIds };
};
