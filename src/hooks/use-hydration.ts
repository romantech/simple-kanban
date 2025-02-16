'use client';

import { useEffect, useState } from 'react';
import { useKanbanStore } from '@/store';

/**
 * @see https://zustand.docs.pmnd.rs/integrations/persisting-store-data#how-can-i-check-if-my-store-has-been-hydrated
 * */
const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubHydrate = useKanbanStore.persist.onHydrate(() => setHydrated(false));

    const unsubFinishHydration = useKanbanStore.persist.onFinishHydration(() => setHydrated(true));

    setHydrated(useKanbanStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};

export { useHydration };
