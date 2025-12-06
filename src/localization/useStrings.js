import { STRINGS } from './strings';
import { useAppContext } from '../context/AppContext';

export const useStrings = () => {
  const { language } = useAppContext();
  return STRINGS[language] || STRINGS.en;
};
