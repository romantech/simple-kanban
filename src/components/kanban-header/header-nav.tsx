import { Grid2x2Plus } from 'lucide-react';
import { ColumnAddDialog, HeaderCommand, HeaderDropdown } from '@/components';
import { Header } from '@/components/ui/header';
import { IconButton } from '@/components/ui/icon-button';
import { Github } from '@/assets';

const HeaderNav = () => {
  return (
    <Header>
      <nav className="flex w-full items-center justify-between lg:p-6">
        <HeaderCommand />
        <div className="flex gap-4">
          <ColumnAddDialog>
            <IconButton
              Icon={Grid2x2Plus}
              iconSize={24}
              className="p-1 lg:hidden"
              tooltipContent="컬럼 추가"
            />
          </ColumnAddDialog>
          <IconButton
            as="a"
            Icon={Github}
            iconSize={24}
            href="https://github.com/romantech/simple-kanban"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden p-1 focus-visible:rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:block"
            tooltipContent="레포지토리"
          />
          <HeaderDropdown />
        </div>
      </nav>
    </Header>
  );
};

export { HeaderNav };
