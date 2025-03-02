import { cn } from '@/lib';

interface ProgressBarProps {
  maxValue: number;
  progress: number;
  className?: string;
}

export const ProgressBar = ({ maxValue, progress, className }: ProgressBarProps) => {
  const percent = maxValue !== 0 ? (progress / maxValue) * 100 : 0;
  const percentText = `${percent.toFixed(0)}%`;

  return (
    <progress
      value={progress}
      max={maxValue}
      aria-label={`진행률: ${percentText}`}
      className={cn(
        'w-full h-1 rounded-full overflow-hidden',
        '[&::-webkit-progress-bar]:bg-charade-900', // Track (background)
        '[&::-webkit-progress-value]:bg-charade-700', // Progress value
        '[&::-moz-progress-bar]:bg-charade-700', // Firefox fallback
        className,
      )}
    />
  );
};
