import { cn, formatKoDate, type TaskId } from '@/lib';
import { Draggable, TaskEditViewDialog } from '@/components';
import { useKanbanStore } from '@/store';
import { motion } from 'motion/react';

interface TaskProps {
  taskId: TaskId;
  className?: string;
}

const Task = ({ taskId, className }: TaskProps) => {
  const task = useKanbanStore((state) => state.tasks[taskId]);

  return (
    <Draggable
      id={task.id}
      data={task}
      type="task"
      element="li"
      className={cn(
        'w-full max-w-[272px] rounded-md bg-charade-950 shadow-md flex flex-col gap-1',
        className,
      )}
    >
      {() => (
        <TaskEditViewDialog task={task}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4"
          >
            <h4 className="line-clamp-2 text-[15px] font-semibold">{task.title}</h4>
            <small className="text-xs text-baltic-400">{formatKoDate(task.createdAt)}</small>
          </motion.div>
        </TaskEditViewDialog>
      )}
    </Draggable>
  );
};

export { Task };
