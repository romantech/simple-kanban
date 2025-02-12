import { type Task } from '@/types';

interface TaskProps {
  task: Task;
}
const Task = ({ task }: TaskProps) => {
  return (
    <li className="min-w-60 cursor-grab rounded-md bg-haiti p-4 shadow-md active:cursor-grabbing">
      <p className="font-semibold">{task.description}</p>
      <small>{task.UpdatedAt}</small>
    </li>
  );
};

export { Task };
