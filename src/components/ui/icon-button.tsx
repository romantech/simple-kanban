'use client';

import { cn } from '@/lib';
import type { ComponentProps, ElementType, FunctionComponent, SVGProps } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMediumScreen } from '@/hooks';

type IconButtonProps<T extends ElementType> = {
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
  const isMediumScreen = useIsMediumScreen();

  const Element = (
    <PolymorphicComp
      className={cn(
        'flex min-w-fit gap-1.5 items-center rounded transition-all hover:text-charade-200 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring p-0.5',
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" height={iconSize} width={iconSize} />
      {label && <span className="text-sm">{label}</span>}
    </PolymorphicComp>
  );

  if (!tooltipContent || !isMediumScreen) return Element;

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
