'use client';

import { cn } from '@/lib';
import { Draggable } from '@/components/drag-and-drop';
import { TaskDetailDialog } from '@/components/kanban-task';
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
      as="li"
      rootDndConfig={{ listeners: false, attributes: false }}
      className={cn(
        'flex w-full max-w-68 flex-col gap-1 rounded-md bg-charade-950 p-0.5 shadow-md transition-colors hover:bg-charade-900/70',
        className,
      )}
    >
      {({ listeners, attributes }) => (
        <TaskDetailDialog task={task} asChild>
          <motion.button
            {...listeners}
            {...attributes}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex cursor-grab flex-col gap-2.5 p-3.5 text-left focus-visible:rounded focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
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
            {hasSubtask && <ProgressBar value={completed} max={total} />}
          </motion.button>
        </TaskDetailDialog>
      )}
    </Draggable>
  );
};

export { Task };
