import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  md: 768,
  lg: 1024,
  xl: 1280,
};

const getBreakpoint = (width) => {
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  return 'sm';
};

export const useBreakpoints = () => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const breakpoint = getBreakpoint(width);

    return {
      width,
      height,
      breakpoint,
      isSm: breakpoint === 'sm',
      isMd: breakpoint === 'md',
      isLg: breakpoint === 'lg',
      isXl: breakpoint === 'xl',
      isMdUp: breakpoint !== 'sm',
      isLgUp: breakpoint === 'lg' || breakpoint === 'xl',
    };
  }, [width, height]);
};
