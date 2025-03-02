import { cn } from '@/lib';

interface ProgressBarProps {
  total: number;
  completed: number;
  className?: string;
}

export const ProgressBar = ({ total, completed, className }: ProgressBarProps) => {
  const percent = total !== 0 ? (completed / total) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={completed}
      aria-label={`Progress: ${percent.toFixed(0)}%`}
      className={cn('flex overflow-hidden rounded bg-charade-800/40', className)}
    >
      <div className="h-1 w-full bg-charade-800 transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
};
