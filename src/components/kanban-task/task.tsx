'use client';

import { cn } from '@/lib';
import { Draggable, TaskEditViewDialog } from '@/components';
import { useKanbanStore } from '@/store';
import { motion } from 'motion/react';
import { type TaskId } from '@/schema';
import { useSubtaskCountLabel } from '@/hooks';

interface TaskProps {
  taskId: TaskId;
  className?: string;
}

const Task = ({ taskId, className }: TaskProps) => {
  const task = useKanbanStore((state) => state.tasks[taskId]);
  const subtaskCountLabel = useSubtaskCountLabel(task.id);

  return (
    <Draggable
      id={task.id}
      data={task}
      type="task"
      element="li"
      rootDndConfig={{ listeners: false, attributes: false }}
      className={cn(
        'w-full max-w-[272px] rounded-md bg-charade-950 shadow-md flex flex-col gap-1 hover:bg-baltic-900',
        className,
      )}
    >
      {({ listeners, attributes }) => (
        <TaskEditViewDialog task={task}>
          <motion.div
            {...listeners}
            {...attributes}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="cursor-grab p-4 text-left"
          >
            <h4 className="line-clamp-2 text-[15px] font-semibold">{task.title}</h4>
            <small className="text-baltic-400">{`하위 작업 ${subtaskCountLabel}`}</small>
          </motion.div>
        </TaskEditViewDialog>
      )}
    </Draggable>
  );
};

export { Task };
