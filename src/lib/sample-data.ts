import { type Kanban } from '@/types';
import { type BoardId } from '@/lib/schema';

const sampleKanbanData = {
  tasks: {
    'Task-3uGbWTjDch-4b-w5dHeNB': {
      id: 'Task-3uGbWTjDch-4b-w5dHeNB',
      columnId: 'Column-uh6jGsYnCfu3peUX5ZF-O',
      title: '기획서 초안 작성',
      description: '프로젝트 개요 및 요구사항을 정리한 기획서 초안을 작성합니다.',
      createdAt: '2025-02-10T09:00:00Z',
      updatedAt: '2025-02-11T14:30:00Z',
    },
    'Task-pMB38_u8k2vTgmC_RTKWx': {
      id: 'Task-pMB38_u8k2vTgmC_RTKWx',
      columnId: 'Column-uh6jGsYnCfu3peUX5ZF-O',
      title: 'UI 디자인 시안 제작',
      description: '디자이너와 협업하여 첫 번째 UI 디자인 시안을 제작합니다.',
      createdAt: '2025-02-10T11:00:00Z',
      updatedAt: '2025-02-12T10:00:00Z',
    },
    'Task-aeUsI5UTxrLOvT5nn4zyS': {
      id: 'Task-aeUsI5UTxrLOvT5nn4zyS',
      columnId: 'Column-uh6jGsYnCfu3peUX5ZF-O',
      title: 'API 설계 및 문서화',
      description: '백엔드 API의 엔드포인트 및 응답 구조를 설계하고 문서화합니다.',
      createdAt: '2025-02-11T09:20:00Z',
      updatedAt: '2025-02-13T15:10:00Z',
    },
    'Task--R1Sp7LkLjx0tglnSugS5': {
      id: 'Task--R1Sp7LkLjx0tglnSugS5',
      columnId: 'Column-rYZJ5DsW8WyWUrIZ-tN9p',
      title: '프론트엔드 컴포넌트 개발',
      description: 'React 기반의 핵심 UI 컴포넌트를 개발하고 스토리북 문서화를 진행합니다.',
      createdAt: '2025-02-12T13:30:00Z',
      updatedAt: '2025-02-14T09:45:00Z',
    },
    'Task-zeGvaJiSGlrOKOMP_hOMa': {
      id: 'Task-zeGvaJiSGlrOKOMP_hOMa',
      columnId: 'Column-rYZJ5DsW8WyWUrIZ-tN9p',
      title: '백엔드 API 개발',
      description: 'Node.js 기반의 RESTful API',
      createdAt: '2025-02-13T10:00:00Z',
      updatedAt: '2025-02-14T12:00:00Z',
    },
    'Task-SpAgEU4qYPJ2Qb0m992Ri': {
      id: 'Task-SpAgEU4qYPJ2Qb0m992Ri',
      columnId: 'Column-U6QHUWMvvizzC56pJyokc',
      title: '운동',
      description: '유산소, 무산소 운동 각각 30분',
      createdAt: '2025-02-14T09:00:00Z',
      updatedAt: '2025-02-15T16:30:00Z',
    },
  },
  columns: {
    'Column-uh6jGsYnCfu3peUX5ZF-O': {
      id: 'Column-uh6jGsYnCfu3peUX5ZF-O',
      boardId: 'Board-q0tzC2fGuBReTjYuzdUHL',
      title: '해야 할 일',
      createdAt: '2025-02-10T08:30:00Z',
      updatedAt: '2025-02-10T08:30:00Z',
      taskIds: [
        'Task-3uGbWTjDch-4b-w5dHeNB',
        'Task-pMB38_u8k2vTgmC_RTKWx',
        'Task-aeUsI5UTxrLOvT5nn4zyS',
      ],
    },
    'Column-rYZJ5DsW8WyWUrIZ-tN9p': {
      id: 'Column-rYZJ5DsW8WyWUrIZ-tN9p',
      boardId: 'Board-q0tzC2fGuBReTjYuzdUHL',
      title: '진행 중',
      createdAt: '2025-02-11T09:00:00Z',
      updatedAt: '2025-02-11T09:00:00Z',
      taskIds: ['Task--R1Sp7LkLjx0tglnSugS5', 'Task-zeGvaJiSGlrOKOMP_hOMa'],
    },
    'Column-U6QHUWMvvizzC56pJyokc': {
      id: 'Column-U6QHUWMvvizzC56pJyokc',
      boardId: 'Board-iYjajYkTqI5GORsBOnS5Q',
      title: '검토 중',
      createdAt: '2025-02-12T10:30:00Z',
      updatedAt: '2025-02-12T10:30:00Z',
      taskIds: ['Task-SpAgEU4qYPJ2Qb0m992Ri'],
    },
    'Column-nAenj9pmiK_CG6LTeA-9V': {
      id: 'Column-nAenj9pmiK_CG6LTeA-9V',
      boardId: 'Board-iYjajYkTqI5GORsBOnS5Q',
      title: '완료',
      createdAt: '2025-02-13T15:00:00Z',
      updatedAt: '2025-02-13T15:00:00Z',
      taskIds: [],
    },
  },
  boards: {
    'Board-q0tzC2fGuBReTjYuzdUHL': {
      id: 'Board-q0tzC2fGuBReTjYuzdUHL',
      title: 'B2B 프로젝트',
      createdAt: '2025-02-10T09:00:00Z',
      updatedAt: '2025-02-10T09:00:00Z',
      columnIds: ['Column-uh6jGsYnCfu3peUX5ZF-O', 'Column-rYZJ5DsW8WyWUrIZ-tN9p'],
    },
    'Board-iYjajYkTqI5GORsBOnS5Q': {
      id: 'Board-iYjajYkTqI5GORsBOnS5Q',
      title: '자기계발',
      createdAt: '2025-02-10T09:00:00Z',
      updatedAt: '2025-02-10T09:00:00Z',
      columnIds: ['Column-U6QHUWMvvizzC56pJyokc', 'Column-nAenj9pmiK_CG6LTeA-9V'],
    },
  },
} as Kanban;

const initialBoardId = 'Board-q0tzC2fGuBReTjYuzdUHL' as BoardId;

export { sampleKanbanData, initialBoardId };
