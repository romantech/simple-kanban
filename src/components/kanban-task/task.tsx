'use client';

import { cn } from '@/lib';
import { Draggable, TaskEditViewDialog } from '@/components';
import { useKanbanStore } from '@/store';
import { motion } from 'motion/react';
import { type TaskId } from '@/schema';
import { useSubtaskCount } from '@/hooks';
import { AlignLeft } from 'lucide-react';
import { ProgressBar } from '@/components/ui/progress-bar';

interface TaskProps {
  taskId: TaskId;
  className?: string;
}

const Task = ({ taskId, className }: TaskProps) => {
  const task = useKanbanStore((state) => state.tasks[taskId]);
  const { label, completed, total } = useSubtaskCount(taskId);

  const hasDesc = Boolean(task.description);
  const hasSubtask = total > 0;

  return (
    <Draggable
      id={task.id}
      data={task}
      type="task"
      element="li"
      rootDndConfig={{ listeners: false, attributes: false }}
      className={cn(
        'w-full max-w-[272px] rounded-md bg-charade-950 shadow-md transition-colors flex flex-col gap-1 hover:bg-charade-900/70 p-0.5',
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
            className="cursor-grab space-y-2 p-3.5 text-left focus-visible:rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <h4 className="line-clamp-2 text-[15px] font-semibold">{task.title}</h4>
            <div
              className={cn('hidden', {
                'flex items-center gap-2 text-baltic-400': hasDesc || hasSubtask,
              })}
            >
              {hasDesc && <AlignLeft className="size-4" />}
              {hasSubtask && <small>{`하위 작업 ${label}`}</small>}
            </div>
            {hasSubtask && <ProgressBar progress={completed} maxValue={total} />}
          </motion.button>
        </TaskEditViewDialog>
      )}
    </Draggable>
  );
};

export { Task };
