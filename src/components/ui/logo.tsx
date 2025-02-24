import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib';

interface LogoProps extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> {
  size?: number;
}

export const Logo = ({ size = 36, className, ...props }: LogoProps) => {
  return (
    <Image
      priority
      src="/favicon.png"
      alt="logo"
      width={size}
      height={size}
      className={cn('object-cover', className)}
      style={{ minWidth: size }}
      {...props}
    />
  );
};
