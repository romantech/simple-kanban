import { cn } from '@/lib';
import type { ComponentProps, ElementType, FunctionComponent, SVGProps } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type IconButtonProps<T extends ElementType = 'button'> = {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  iconSize?: number;
  as?: T;
  label?: string;
  tooltipContent?: string;
} & Omit<ComponentProps<T>, 'as'>;

const IconButton = <T extends ElementType = 'button'>({
  as,
  Icon,
  label,
  tooltipContent,
  className,
  iconSize = 17,
  ...props
}: IconButtonProps<T>) => {
  const PolymorphicComp = as ?? 'button';

  const Element = (
    <PolymorphicComp
      className={cn(
        'flex min-w-fit gap-1.5 items-center rounded transition-all hover:text-charade-200 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring p-0.5',
        className,
      )}
      {...props}
    >
      <Icon height={iconSize} width={iconSize} />
      {label && <span className="text-sm">{label}</span>}
    </PolymorphicComp>
  );

  if (!tooltipContent) return Element;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{Element}</TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { IconButton };
