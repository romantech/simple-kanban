import { type Boards, type Columns, type Subtasks, type Tasks } from '@/types';

import { type BoardId } from '@/schema';

export const sampleSubtasks = {
  'Subtask-04yUQUaG': {
    id: 'Subtask-04yUQUaG',
    taskId: 'Task-Gy0uMXah',
    title: '상태 관리',
    createdAt: '2025-03-04T03:44:19.284Z',
    updatedAt: '2025-03-04T03:46:32.172Z',
    completed: false,
  },
  'Subtask-es69Eu9f': {
    id: 'Subtask-es69Eu9f',
    taskId: 'Task-bFR8fIiN',
    title: '사용자 분석',
    createdAt: '2025-03-04T03:45:48.197Z',
    updatedAt: '2025-03-04T03:45:48.197Z',
    completed: false,
  },
  'Subtask-TRAKo6io': {
    id: 'Subtask-TRAKo6io',
    taskId: 'Task-bFR8fIiN',
    title: '기능 목록',
    createdAt: '2025-03-04T03:46:00.385Z',
    updatedAt: '2025-03-04T03:46:00.385Z',
    completed: false,
  },
  'Subtask-46qHQKSx': {
    id: 'Subtask-46qHQKSx',
    taskId: 'Task-Gy0uMXah',
    title: 'API 연동',
    createdAt: '2025-03-04T03:49:47.580Z',
    updatedAt: '2025-03-04T03:49:47.580Z',
    completed: false,
  },
  'Subtask-U51h8KzW': {
    id: 'Subtask-U51h8KzW',
    taskId: 'Task-Gy0uMXah',
    title: '요구사항 분석',
    createdAt: '2025-03-04T03:49:57.140Z',
    updatedAt: '2025-03-04T03:49:58.849Z',
    completed: true,
  },
  'Subtask-1ZPNwxFf': {
    id: 'Subtask-1ZPNwxFf',
    taskId: 'Task-Gy0uMXah',
    title: '요구사항 분석',
    createdAt: '2025-03-04T03:53:23.971Z',
    updatedAt: '2025-03-04T03:53:34.102Z',
    completed: true,
  },
  'Subtask-R_dETRBA': {
    id: 'Subtask-R_dETRBA',
    taskId: 'Task-Gy0uMXah',
    title: '상태관리',
    createdAt: '2025-03-04T03:53:27.541Z',
    updatedAt: '2025-03-04T03:53:27.541Z',
    completed: false,
  },
  'Subtask-QuV5J16X': {
    id: 'Subtask-QuV5J16X',
    taskId: 'Task-Gy0uMXah',
    title: 'API 연동',
    createdAt: '2025-03-04T03:53:29.779Z',
    updatedAt: '2025-03-04T03:53:29.779Z',
    completed: false,
  },
  'Subtask-waVAzKHB': {
    id: 'Subtask-waVAzKHB',
    taskId: 'Task-bFR8fIiN',
    title: '사용자 분석',
    createdAt: '2025-03-04T03:53:46.658Z',
    updatedAt: '2025-03-04T03:53:46.658Z',
    completed: false,
  },
  'Subtask-tZOv1U7n': {
    id: 'Subtask-tZOv1U7n',
    taskId: 'Task-bFR8fIiN',
    title: '기능 목록',
    createdAt: '2025-03-04T03:53:48.861Z',
    updatedAt: '2025-03-04T03:53:48.861Z',
    completed: false,
  },
} as Subtasks;

export const sampleTasks = {
  'Task-bFR8fIiN': {
    id: 'Task-bFR8fIiN',
    columnId: 'Column-ABT8Ykzf',
    title: '기획서 초안 작성',
    description: '프로젝트 개요 및 요구사항을 정리한 기획서 초안을 작성합니다.',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-11T14:30:00Z',
    subtaskIds: ['Subtask-tZOv1U7n', 'Subtask-waVAzKHB'],
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
    subtaskIds: ['Subtask-QuV5J16X', 'Subtask-R_dETRBA', 'Subtask-1ZPNwxFf'],
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
  'Column-Ngwo2p8B': {
    id: 'Column-Ngwo2p8B',
    boardId: 'Board-9tQ2iHIf',
    title: '진행 전',
    createdAt: '2025-03-04T04:02:57.820Z',
    updatedAt: '2025-03-04T04:02:57.820Z',
    taskIds: [],
  },
  'Column-ayXb47rL': {
    id: 'Column-ayXb47rL',
    boardId: 'Board-9tQ2iHIf',
    title: '진행 중',
    createdAt: '2025-03-04T04:02:57.820Z',
    updatedAt: '2025-03-04T04:02:57.820Z',
    taskIds: [],
  },
  'Column-oW3zj4Dg': {
    id: 'Column-oW3zj4Dg',
    boardId: 'Board-9tQ2iHIf',
    title: '완료',
    createdAt: '2025-03-04T04:02:57.820Z',
    updatedAt: '2025-03-04T04:02:57.820Z',
    taskIds: [],
  },
} as Columns;

export const sampleBoards = {
  'Board-BORcFWLd': {
    id: 'Board-BORcFWLd',
    title: '샘플 보드',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T09:00:00Z',
    columnIds: ['Column-ABT8Ykzf', 'Column-x8abUHKS'],
  },
  'Board-9tQ2iHIf': {
    id: 'Board-9tQ2iHIf',
    title: '개인 업무',
    createdAt: '2025-03-04T04:02:57.819Z',
    updatedAt: '2025-03-04T04:02:57.819Z',
    columnIds: ['Column-Ngwo2p8B', 'Column-ayXb47rL', 'Column-oW3zj4Dg'],
  },
} as Boards;

export const sampleBoardId = 'Board-BORcFWLd' as BoardId;
