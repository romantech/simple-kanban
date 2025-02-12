import { type Kanban } from '@/types';

const tasks: Kanban['tasks'] = {
  'task-1': {
    id: 'task-1',
    title: '첫 번째 태스크',
    description: '첫 번째 태스크에 대한 설명',
    createdAt: '2025-02-12T09:00:00Z',
    UpdatedAt: '2025-02-12T09:00:00Z',
  },
  'task-2': {
    id: 'task-2',
    title: '두 번째 태스크',
    description: '두 번째 태스크에 대한 설명',
    createdAt: '2025-02-12T09:10:00Z',
    UpdatedAt: '2025-02-12T09:10:00Z',
  },
  'task-3': {
    id: 'task-3',
    title: '세 번째 태스크',
    description: '세 번째 태스크에 대한 설명',
    createdAt: '2025-02-12T09:20:00Z',
    UpdatedAt: '2025-02-12T09:20:00Z',
  },
};

const columns: Kanban['columns'] = {
  'column-1': {
    id: 'column-1',
    title: '해야 할 일',
    createdAt: '2025-02-12T08:50:00Z',
    taskIds: ['task-1', 'task-2'],
  },
  'column-2': {
    id: 'column-2',
    title: '진행 중',
    createdAt: '2025-02-12T08:55:00Z',
    taskIds: ['task-3'],
  },
  'column-3': {
    id: 'column-3',
    title: '완료',
    createdAt: '2025-02-12T09:00:00Z',
    taskIds: [],
  },
};

const boards: Kanban['boards'] = {
  'board-1': {
    id: 'board-1',
    title: '프로젝트 보드',
    columnIds: ['column-1', 'column-2', 'column-3'],
  },
};

const sampleKanbanData: Kanban = {
  tasks,
  columns,
  boards,
};

export default sampleKanbanData;
