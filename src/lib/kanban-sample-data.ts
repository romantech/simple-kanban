import { type Boards, type Columns, type Tasks } from '@/types';

import { type BoardId } from '@/schema';

export const sampleTasks = {
  'Task-bFR8fIiN': {
    id: 'Task-bFR8fIiN',
    columnId: 'Column-ABT8Ykzf',
    title: '기획서 초안 작성',
    description: '프로젝트 개요 및 요구사항을 정리한 기획서 초안을 작성합니다.',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-11T14:30:00Z',
    subtaskIds: [],
  },
  'Task-0WmrHwcw': {
    id: 'Task-0WmrHwcw',
    columnId: 'Column-ABT8Ykzf',
    title: 'UI 디자인 시안 제작',
    description: '디자이너와 협업하여 첫 번째 UI 디자인 시안을 제작합니다.',
    createdAt: '2025-02-10T11:00:00Z',
    updatedAt: '2025-02-12T10:00:00Z',
    subtaskIds: [],
  },
  'Task-ylr--OK9': {
    id: 'Task-ylr--OK9',
    columnId: 'Column-ABT8Ykzf',
    title: 'API 설계 및 문서화',
    description: '백엔드 API의 엔드포인트 및 응답 구조를 설계하고 문서화합니다.',
    createdAt: '2025-02-11T09:20:00Z',
    updatedAt: '2025-02-13T15:10:00Z',
    subtaskIds: [],
  },
  'Task-Gy0uMXah': {
    id: 'Task-Gy0uMXah',
    columnId: 'Column-x8abUHKS',
    title: '프론트엔드 컴포넌트 개발',
    description: 'React 기반의 핵심 UI 컴포넌트를 개발하고 스토리북 문서화를 진행합니다.',
    createdAt: '2025-02-12T13:30:00Z',
    updatedAt: '2025-02-14T09:45:00Z',
    subtaskIds: [],
  },
  'Task-sOCz2HC0': {
    id: 'Task-sOCz2HC0',
    columnId: 'Column-x8abUHKS',
    title: '백엔드 API 개발',
    description: 'Node.js 기반의 RESTful API',
    createdAt: '2025-02-13T10:00:00Z',
    updatedAt: '2025-02-14T12:00:00Z',
    subtaskIds: [],
  },
  'Task-cy26Iz32': {
    id: 'Task-cy26Iz32',
    columnId: 'Column-aAF9Tddv',
    title: '운동',
    description: '유산소, 무산소 운동 각각 30분',
    createdAt: '2025-02-14T09:00:00Z',
    updatedAt: '2025-02-15T16:30:00Z',
    subtaskIds: [],
  },
} as Tasks;

export const sampleColumns = {
  'Column-ABT8Ykzf': {
    id: 'Column-ABT8Ykzf',
    boardId: 'Board-BORcFWLd',
    title: '해야 할 일',
    createdAt: '2025-02-10T08:30:00Z',
    updatedAt: '2025-02-10T08:30:00Z',
    taskIds: ['Task-bFR8fIiN', 'Task-0WmrHwcw', 'Task-ylr--OK9'],
  },
  'Column-x8abUHKS': {
    id: 'Column-x8abUHKS',
    boardId: 'Board-BORcFWLd',
    title: '진행 중',
    createdAt: '2025-02-11T09:00:00Z',
    updatedAt: '2025-02-11T09:00:00Z',
    taskIds: ['Task-Gy0uMXah', 'Task-sOCz2HC0'],
  },
  'Column-aAF9Tddv': {
    id: 'Column-aAF9Tddv',
    boardId: 'Board-xvtYzhfX',
    title: '검토 중',
    createdAt: '2025-02-12T10:30:00Z',
    updatedAt: '2025-02-12T10:30:00Z',
    taskIds: ['Task-cy26Iz32'],
  },
  'Column-WkrLI132': {
    id: 'Column-WkrLI132',
    boardId: 'Board-xvtYzhfX',
    title: '완료',
    createdAt: '2025-02-13T15:00:00Z',
    updatedAt: '2025-02-13T15:00:00Z',
    taskIds: [],
  },
} as Columns;

export const sampleBoards = {
  'Board-BORcFWLd': {
    id: 'Board-BORcFWLd',
    title: 'B2B 프로젝트',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z',
    columnIds: ['Column-ABT8Ykzf', 'Column-x8abUHKS'],
  },
  'Board-xvtYzhfX': {
    id: 'Board-xvtYzhfX',
    title: '자기계발',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z',
    columnIds: ['Column-aAF9Tddv', 'Column-WkrLI132'],
  },
} as Boards;

export const sampleBoardId = 'Board-BORcFWLd' as BoardId;
