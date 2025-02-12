import { type Boards, type Columns, type Kanban, type Tasks } from '@/types';

const tasks: Tasks = {
  'task-1': {
    id: 'task-1',
    title: '기획서 초안 작성',
    description: '프로젝트 개요 및 요구사항을 정리한 기획서 초안을 작성합니다.',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-11T14:30:00Z',
  },
  'task-2': {
    id: 'task-2',
    title: 'UI 디자인 시안 제작',
    description: '디자이너와 협업하여 첫 번째 UI 디자인 시안을 제작합니다.',
    createdAt: '2025-02-10T11:00:00Z',
    updatedAt: '2025-02-12T10:00:00Z',
  },
  'task-3': {
    id: 'task-3',
    title: 'API 설계 및 문서화',
    description: '백엔드 API의 엔드포인트 및 응답 구조를 설계하고 문서화합니다.',
    createdAt: '2025-02-11T09:20:00Z',
    updatedAt: '2025-02-13T15:10:00Z',
  },
  'task-4': {
    id: 'task-4',
    title: '프론트엔드 컴포넌트 개발',
    description: 'React 기반의 핵심 UI 컴포넌트를 개발하고 스토리북 문서화를 진행합니다.',
    createdAt: '2025-02-12T13:30:00Z',
    updatedAt: '2025-02-14T09:45:00Z',
  },
  'task-5': {
    id: 'task-5',
    title: '백엔드 API 개발',
    description: 'Node.js 기반의 RESTful API를 구현하고 테스트합니다.',
    createdAt: '2025-02-13T10:00:00Z',
    updatedAt: '2025-02-14T12:00:00Z',
  },
  'task-6': {
    id: 'task-6',
    title: '테스트 및 QA',
    description: '기능 테스트 및 버그 리포트를 작성하고 개발팀과 공유합니다.',
    createdAt: '2025-02-14T09:00:00Z',
    updatedAt: '2025-02-15T16:30:00Z',
  },
};

const columns: Columns = {
  'column-1': {
    id: 'column-1',
    title: '해야 할 일',
    createdAt: '2025-02-10T08:30:00Z',
    taskIds: ['task-1', 'task-2', 'task-3'],
  },
  'column-2': {
    id: 'column-2',
    title: '진행 중',
    createdAt: '2025-02-11T09:00:00Z',
    taskIds: ['task-4', 'task-5'],
  },
  'column-3': {
    id: 'column-3',
    title: '검토 중',
    createdAt: '2025-02-12T10:30:00Z',
    taskIds: ['task-6'],
  },
  'column-4': {
    id: 'column-4',
    title: '완료',
    createdAt: '2025-02-13T15:00:00Z',
    taskIds: [],
  },
};

const boards: Boards = {
  'board-1': {
    id: 'board-1',
    title: '웹 프로젝트 개발',
    columnIds: ['column-1', 'column-2'],
  },
  'board-2': {
    id: 'board-2',
    title: '운동하기',
    columnIds: ['column-3', 'column-4'],
  },
};

const sampleKanbanData: Kanban = {
  tasks,
  columns,
  boards,
};

const initialBoardId = 'board-1';

export { sampleKanbanData, initialBoardId };
