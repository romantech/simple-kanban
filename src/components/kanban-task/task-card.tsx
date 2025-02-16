import { cn, formatKoDate, type TaskId } from '@/lib';
import { Draggable, TaskEditViewDialog } from '@/components';
import { useKanbanStore } from '@/store';
import { Fragment } from 'react';

interface TaskProps {
  taskId: TaskId;
  className?: string;
}

const TaskCard = ({ taskId, className }: TaskProps) => {
  const task = useKanbanStore((state) => state.tasks[taskId]);

  return (
    <TaskEditViewDialog task={task}>
      <Draggable
        id={task.id}
        data={task}
        type="task"
        element="li"
        className={cn(
          'w-full max-w-[272px] rounded-md bg-charade-950 p-4 shadow-md flex flex-col gap-1',
          className,
        )}
      >
        {() => (
          <Fragment>
            <h4 className="line-clamp-2 text-[15px] font-semibold">{task.title}</h4>
            <small className="text-xs text-baltic-400">{formatKoDate(task.createdAt)}</small>
          </Fragment>
        )}
      </Draggable>
    </TaskEditViewDialog>
  );
};

export { TaskCard };
