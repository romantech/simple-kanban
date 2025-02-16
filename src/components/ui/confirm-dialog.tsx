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

interface AlertProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  asChild?: boolean;
}

const ConfirmDialog = ({
  title,
  description,
  onConfirm,
  children,
  asChild = false,
}: PropsWithChildren<AlertProps>) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="rounded" asChild={asChild}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ConfirmDialog };
