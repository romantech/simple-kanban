import { type Task } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TaskProps {
  task: Task;
}
const Task = ({ task }: TaskProps) => {
  return (
    <li className="min-w-60 cursor-grab rounded-md bg-charade-950 p-4 shadow-md active:cursor-grabbing">
      <p className="line-clamp-2 text-[15px] font-semibold">{task.description}</p>
      <small className="text-xs text-baltic-400">
        {format(task.updatedAt, 'yyyy-MM-dd(eee) HH:mm', { locale: ko })}
      </small>
    </li>
  );
};

export { Task };
