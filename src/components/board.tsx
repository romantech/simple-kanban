import { type Board } from '@/types';
import { AddColumn, Column } from '@/components';
import { useKanbanStore } from '@/store';
import { useShallow } from 'zustand/react/shallow';

const Board = () => {
  // useShallow: 셀렉터 반환값의 "얕은 비교" 수행
  // 객체/배열 반환 시 내부 프로퍼티 변경을 감지하여 불필요한 리렌더링 방지
  // 단일 원시 타입 값은 기본 비교로 충분하므로 useShallow 불필요
  const board = useKanbanStore(useShallow(({ boards, currentBoardId }) => boards[currentBoardId]));

  return (
    <div className="scroll-custom flex w-full gap-4 overflow-x-auto p-6">
      {board.columnIds.map((columnId) => (
        <Column key={columnId} columnId={columnId} />
      ))}
      <div className="ml-auto mt-11 flex">
        <AddColumn />
      </div>
    </div>
  );
};

export { Board };
