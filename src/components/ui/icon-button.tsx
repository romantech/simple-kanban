import { cn } from '@/lib';
import type { ButtonHTMLAttributes, FunctionComponent, SVGProps } from 'react';

interface DialogButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  iconSize?: number;
  label?: string;
}

const IconButton = ({
  as: Component = 'button',
  Icon,
  label,
  className,
  iconSize = 16,
  ...props
}: DialogButtonProps) => {
  return (
    <Component
      className={cn(
        'flex min-w-fit gap-1.5 items-center rounded transition-all hover:text-charade-200 active:scale-95',
        className,
      )}
      {...props}
    >
      <Icon height={iconSize} width={iconSize} />
      {label && <span className="text-sm">{label}</span>}
    </Component>
  );
};

export { IconButton };
