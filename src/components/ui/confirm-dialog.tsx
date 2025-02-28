import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { type PropsWithChildren } from 'react';
import { type Void } from '@/types';

interface AlertProps {
  title: string;
  description?: string;
  onConfirm: Void;
  onCancel?: Void;
  asChild?: boolean;
  disabled?: boolean;
}

const ConfirmDialog = ({
  title,
  description,
  onConfirm,
  onCancel,
  children,
  disabled = false,
  asChild = false,
}: PropsWithChildren<AlertProps>) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="focus-visible:rounded" disabled={disabled} asChild={asChild}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ConfirmDialog };
