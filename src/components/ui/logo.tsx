import Image, { type ImageProps } from 'next/image';

interface LogoProps extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> {
  size?: number;
}

export const Logo = ({ size = 30, ...props }: LogoProps) => {
  return (
    <Image
      priority
      src="/favicon.png"
      alt="logo"
      width={size}
      height={size}
      className="size-auto object-cover"
      {...props}
    />
  );
};
