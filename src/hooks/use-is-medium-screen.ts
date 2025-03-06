'use client';

import { useMediaQuery } from 'usehooks-ts';

export const useIsMediumScreen = () => {
  return useMediaQuery('(min-width: 40rem)');
};
