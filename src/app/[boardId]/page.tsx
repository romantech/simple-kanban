import { Kanban } from '@/components';
import { type BoardId } from '@/schema';

interface Props {
  params: Promise<{ boardId: BoardId }>;
  searchParams: Promise<{ title?: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { title = 'Board' } = await searchParams;

  return { title };
}

export default async function BoardPage({ params }: Props) {
  const { boardId } = await params;

  return <Kanban boardId={boardId} />;
}
