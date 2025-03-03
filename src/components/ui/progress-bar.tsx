import { cn } from '@/lib';

interface ProgressBarProps {
  max: number;
  value: number;
  className?: string;
  valueClassName?: string;
}
export const ProgressBar = ({ max, value, className, valueClassName }: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? (clampedProgress / max) * 100 : 0;
  const percentText = `${percent.toFixed(0)}%`;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clampedProgress}
      aria-label={`Progress: ${percent.toFixed(0)}%`}
      className={cn('flex overflow-hidden rounded bg-charade-900', className)}
    >
      <div
        className={cn('h-1 w-full bg-charade-600 transition-all', valueClassName)}
        style={{ width: percentText }}
      />
    </div>
  );
};
