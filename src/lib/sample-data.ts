import { type Boards, type Columns, type Kanban, type Tasks } from '@/types';
import { generateIds } from '@/lib/utils';

const taskIds = generateIds('task', 6);

const tasks: Tasks = {
  [taskIds[0]]: {
    id: taskIds[0],
    title: '기획서 초안 작성',
    description: '프로젝트 개요 및 요구사항을 정리한 기획서 초안을 작성합니다.',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-11T14:30:00Z',
  },
  [taskIds[1]]: {
    id: taskIds[1],
    title: 'UI 디자인 시안 제작',
    description: '디자이너와 협업하여 첫 번째 UI 디자인 시안을 제작합니다.',
    createdAt: '2025-02-10T11:00:00Z',
    updatedAt: '2025-02-12T10:00:00Z',
  },
  [taskIds[2]]: {
    id: taskIds[2],
    title: 'API 설계 및 문서화',
    description: '백엔드 API의 엔드포인트 및 응답 구조를 설계하고 문서화합니다.',
    createdAt: '2025-02-11T09:20:00Z',
    updatedAt: '2025-02-13T15:10:00Z',
  },
  [taskIds[3]]: {
    id: taskIds[3],
    title: '프론트엔드 컴포넌트 개발',
    description: 'React 기반의 핵심 UI 컴포넌트를 개발하고 스토리북 문서화를 진행합니다.',
    createdAt: '2025-02-12T13:30:00Z',
    updatedAt: '2025-02-14T09:45:00Z',
  },
  [taskIds[4]]: {
    id: taskIds[4],
    title: '백엔드 API 개발',
    description: 'Node.js 기반의 RESTful API',
    createdAt: '2025-02-13T10:00:00Z',
    updatedAt: '2025-02-14T12:00:00Z',
  },
  [taskIds[5]]: {
    id: taskIds[5],
    title: '운동',
    description: '유산소, 무산소 운동 각각 30분',
    createdAt: '2025-02-14T09:00:00Z',
    updatedAt: '2025-02-15T16:30:00Z',
  },
};

const columnIds = generateIds('column', 4);

const columns: Columns = {
  [columnIds[0]]: {
    id: columnIds[0],
    title: '해야 할 일',
    createdAt: '2025-02-10T08:30:00Z',
    taskIds: [taskIds[0], taskIds[1], taskIds[2]],
  },
  [columnIds[1]]: {
    id: columnIds[1],
    title: '진행 중',
    createdAt: '2025-02-11T09:00:00Z',
    taskIds: [taskIds[3], taskIds[4]],
  },
  [columnIds[2]]: {
    id: columnIds[2],
    title: '검토 중',
    createdAt: '2025-02-12T10:30:00Z',
    taskIds: [taskIds[5]],
  },
  [columnIds[3]]: {
    id: columnIds[3],
    title: '완료',
    createdAt: '2025-02-13T15:00:00Z',
    taskIds: [],
  },
};

const boardIds = generateIds('board', 2);

const boards: Boards = {
  [boardIds[0]]: {
    id: boardIds[0],
    title: 'B2B 프로젝트',
    createdAt: '2025-02-10T09:00:00Z',
    columnIds: [columnIds[0], columnIds[1]],
  },
  [boardIds[1]]: {
    id: boardIds[1],
    title: '자기계발',
    createdAt: '2025-02-10T09:00:00Z',
    columnIds: [columnIds[2], columnIds[3]],
  },
};

const sampleKanbanData: Kanban = {
  tasks,
  columns,
  boards,
};

const initialBoardId = boardIds[0];

export { sampleKanbanData, initialBoardId };
