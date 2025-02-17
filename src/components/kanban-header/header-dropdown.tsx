import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useState } from 'react';
import { useKanbanStore } from '@/store';

const HeaderDropdown = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const currentBoardId = useKanbanStore.use.currentBoardId();
  const deleteBoard = useKanbanStore.use.deleteBoard();
  const getBoardCount = useKanbanStore.use.getBoardCount();
  const shouldDisableDelete = getBoardCount() <= 1;

  return (
    <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 font-semibold">
        <DropdownMenuLabel>보드 관리</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>보드 수정 (미구현)</DropdownMenuItem>
          <ConfirmDialog
            disabled={shouldDisableDelete}
            title="보드를 삭제할까요?"
            description="보드에 있는 모든 컬럼과 작업들도 삭제돼요"
            onConfirm={() => {
              deleteBoard(currentBoardId);
              setOpenMenu(false);
            }}
            onCancel={() => setOpenMenu(false)}
          >
            <DropdownMenuItem disabled={shouldDisableDelete} onSelect={(e) => e.preventDefault()}>
              보드 삭제
            </DropdownMenuItem>
          </ConfirmDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { HeaderDropdown };
