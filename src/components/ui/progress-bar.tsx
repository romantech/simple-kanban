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
      className={cn('flex w-full h-1 rounded-full overflow-hidden bg-charade-900', className)}
    >
      <div className="bg-charade-700 transition-all" style={{ width: `${percent}%` }} />
    </div>
  );
};
