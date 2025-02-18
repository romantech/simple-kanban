'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useKanbanStore } from '@/store';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 현재 스토어에 있는 샘플 데이터 조회(useStore.getState() 사용하면 반응성 없음)
    router.replace(useKanbanStore.getState().currentBoardId);
  }, [router]);

  return null;
}
