import { type Task } from '@/types';

interface TaskProps {
  task: Task;
}
const Task = ({ task }: TaskProps) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <small>{task.UpdatedAt}</small>
    </div>
  );
};

export { Task };
