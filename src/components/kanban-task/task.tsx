'use client';

import { cn } from '@/lib';
import { Draggable, TaskEditViewDialog } from '@/components';
import { useKanbanStore } from '@/store';
import { motion } from 'motion/react';
import { type TaskId } from '@/schema';
import { useSubtaskCount } from '@/hooks';
import { ProgressBar } from '@/components/ui/progress-bar';

interface TaskProps {
  taskId: TaskId;
  className?: string;
}

const Task = ({ taskId, className }: TaskProps) => {
  const task = useKanbanStore((state) => state.tasks[taskId]);

  const { label, completed, total } = useSubtaskCount(taskId);

  return (
    <Draggable
      id={task.id}
      data={task}
      type="task"
      element="li"
      rootDndConfig={{ listeners: false, attributes: false }}
      className={cn(
        'w-full max-w-[272px] rounded-md bg-charade-950 shadow-md flex flex-col gap-1 hover:bg-baltic-900 p-0.5',
        className,
      )}
    >
      {({ listeners, attributes }) => (
        <TaskEditViewDialog task={task} asChild>
          <motion.button
            {...listeners}
            {...attributes}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="cursor-grab space-y-1 p-3.5 text-left focus-visible:rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <h4 className="line-clamp-2 text-[15px] font-semibold">{task.title}</h4>
            <small className="text-baltic-400">{`하위 작업 ${label}`}</small>
            <ProgressBar completed={completed} total={total} />
          </motion.button>
        </TaskEditViewDialog>
      )}
    </Draggable>
  );
};

export { Task };
