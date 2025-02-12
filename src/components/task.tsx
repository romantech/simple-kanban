import { type Task } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TaskProps {
  task: Task;
}
const Task = ({ task }: TaskProps) => {
  return (
    <li className="min-w-60 cursor-grab rounded-md bg-haiti p-4 shadow-md active:cursor-grabbing">
      <p className="font-semibold">{task.description}</p>
      <small>{format(task.UpdatedAt, 'yyyy-MM-dd(eee) HH:mm', { locale: ko })}</small>
    </li>
  );
};

export { Task };
