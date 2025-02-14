import { formatKoDate, type TaskFields } from '@/lib';

const TaskViewContent = ({ task }: { task: TaskFields }) => {
  return (
    <div className="flex flex-col gap-4 py-4 text-sm">
      <div className="space-y-1">
        <span className="font-semibold text-baltic-400">작업 설명</span>
        <p>{task.description ?? '설명이 없어요'}</p>
      </div>
      <div className="space-y-1">
        <span className="font-semibold text-baltic-400">업데이트 날짜</span>
        <p>{formatKoDate(task.createdAt)}</p>
      </div>
    </div>
  );
};

export { TaskViewContent };
