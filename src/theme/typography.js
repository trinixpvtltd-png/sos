import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const POPPINS = {
  regular: 'Poppins_400Regular',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

const NOTO = {
  regular: 'NotoSansDevanagari_400Regular',
  semibold: 'NotoSansDevanagari_600SemiBold',
  bold: 'NotoSansDevanagari_600SemiBold',
};

export const useTypography = () => {
  const { language } = useAppContext();

  return useMemo(() => {
    const family = language === 'hi' ? NOTO : POPPINS;

    return {
      regular: family.regular,
      semibold: family.semibold,
      bold: family.bold,
      bilingual: NOTO.semibold,
    };
  }, [language]);
};
