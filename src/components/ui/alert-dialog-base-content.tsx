import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type PropsWithChildren } from 'react';
import { type Void } from '@/types';
import { cn } from '@/lib';

interface AlertProps {
  title: string;
  description?: string;
  className?: string;
  onConfirm: Void;
  onCancel?: Void;
}

const AlertDialogBaseContent = ({
  title,
  description,
  className,
  onConfirm,
  onCancel,
}: PropsWithChildren<AlertProps>) => {
  return (
    <AlertDialogContent className={cn('max-w-md', className)}>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>취소</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>확인</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export { AlertDialogBaseContent };
