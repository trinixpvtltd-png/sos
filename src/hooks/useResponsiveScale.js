import { useCallback, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

export const useResponsiveScale = () => {
  const { width, height } = useWindowDimensions();

  const scale = useCallback(
    (size) => (width / GUIDELINE_BASE_WIDTH) * size,
    [width]
  );

  const verticalScale = useCallback(
    (size) => (height / GUIDELINE_BASE_HEIGHT) * size,
    [height]
  );

  const moderateScale = useCallback(
    (size, factor = 0.5) => size + (scale(size) - size) * factor,
    [scale]
  );

  return useMemo(
    () => ({ width, height, scale, verticalScale, moderateScale }),
    [width, height, scale, verticalScale, moderateScale]
  );
};
