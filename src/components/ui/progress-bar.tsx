import { cn } from '@/lib';

interface ProgressBarProps {
  maxValue: number;
  progress: number;
  className?: string;
}

export const ProgressBar = ({ maxValue, progress, className }: ProgressBarProps) => {
  const percent = maxValue !== 0 ? (progress / maxValue) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-valuenow={progress}
      aria-label={`Progress: ${percent.toFixed(0)}%`}
      className={cn('flex overflow-hidden rounded bg-charade-900', className)}
    >
      <div className="h-1 w-full bg-charade-600 transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
};
