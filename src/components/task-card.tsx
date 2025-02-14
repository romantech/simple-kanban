import { formatKoDate, type TaskId } from '@/lib';
import { Draggable, TaskDialog } from '@/components';
import { useKanbanStore } from '@/store';

interface TaskProps {
  taskId: TaskId;
}

const TaskCard = ({ taskId }: TaskProps) => {
  const task = useKanbanStore((state) => state.tasks[taskId]);

  return (
    <TaskDialog task={task}>
      <Draggable
        id={task.id}
        data={{ type: 'task' }}
        element="li"
        className="min-w-60 rounded-md bg-charade-950 p-4 shadow-md"
      >
        <h4 className="line-clamp-2 text-[15px] font-semibold">{task.title}</h4>
        <small className="text-xs text-baltic-400">{formatKoDate(task.createdAt)}</small>
      </Draggable>
    </TaskDialog>
  );
};

export { TaskCard };
