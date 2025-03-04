'use client';

import { useCallback, useState } from 'react';

export type UseDisclosure = ReturnType<typeof useDisclosure>;

export const useDisclosure = (initialState = false) => {
  const [open, setOpen] = useState(initialState);

  const onOpenChange = useCallback((open: boolean) => setOpen(open), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  return { open, onOpenChange, toggle };
};
