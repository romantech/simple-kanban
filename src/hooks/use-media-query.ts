'use client';

import { configResponsive, useResponsive } from 'ahooks';

/** bootstrap config + ms */
const config = {
  xs: 0,
  sm: 576, // mobile
  ms: 640, // custom
  md: 768, // tablet
  lg: 992, // desktop
  xl: 1200,
};

configResponsive(config);

export const useMediaQuery = (breakPoint: keyof typeof config) => {
  const responsive = useResponsive();
  return responsive[breakPoint];
};
