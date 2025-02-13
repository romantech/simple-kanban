import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { type Task } from '@/lib';

interface TaskProps {
  task: Task;
}
const Task = ({ task }: TaskProps) => {
  return (
    <li className="min-w-60 cursor-grab rounded-md bg-charade-950 p-4 shadow-md active:cursor-grabbing">
      <h4 className="line-clamp-2 text-[15px] font-semibold">{task.title}</h4>
      <small className="text-xs text-baltic-400">
        {format(task.updatedAt, 'yyyy-MM-dd(eee) HH:mm', { locale: ko })}
      </small>
    </li>
  );
};

export { Task };
