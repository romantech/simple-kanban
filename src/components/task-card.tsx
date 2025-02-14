import { formatKoDate, type Task } from '@/lib';
import { TaskDialog } from '@/components';

interface TaskProps {
  task: Task;
}

const TaskCard = ({ task }: TaskProps) => {
  return (
    <TaskDialog task={task}>
      <li className="min-w-60 cursor-grab rounded-md bg-charade-950 p-4 shadow-md active:cursor-grabbing">
        <h4 className="line-clamp-2 text-[15px] font-semibold">{task.title}</h4>
        <small className="text-xs text-baltic-400">{formatKoDate(task.createdAt)}</small>
      </li>
    </TaskDialog>
  );
};

export { TaskCard };
