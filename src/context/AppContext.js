import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { STORAGE_KEYS } from '../storage/keys';
import { storage } from '../storage/storage';

const AppContext = createContext();

const DEFAULT_LANGUAGE = 'en';
const DEFAULT_ROLE = 'citizen';
export const DEMO_ROLES = ['citizen', 'authority', 'ngo', 'admin'];

const normalizeLanguage = (value) => (value === 'hi' ? 'hi' : 'en');
const normalizeRole = (value) => (DEMO_ROLES.includes(value) ? value : DEFAULT_ROLE);

export const AppProvider = ({ children }) => {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false);
  const [demoRole, setDemoRoleState] = useState(DEFAULT_ROLE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      const [savedLanguage, savedAuth, savedRole] = await Promise.all([
        storage.getString(STORAGE_KEYS.language, DEFAULT_LANGUAGE),
        storage.getJSON(STORAGE_KEYS.isAuthenticated, false),
        storage.getString(STORAGE_KEYS.demoRole, DEFAULT_ROLE),
      ]);

      if (!mounted) {
        return;
      }

      setLanguageState(normalizeLanguage(savedLanguage));
      setIsAuthenticatedState(Boolean(savedAuth));
      setDemoRoleState(normalizeRole(savedRole));
      setIsHydrated(true);
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = useCallback((nextLanguage) => {
    const normalized = normalizeLanguage(nextLanguage);
    setLanguageState(normalized);
    storage.setString(STORAGE_KEYS.language, normalized);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      storage.setString(STORAGE_KEYS.language, next);
      return next;
    });
  }, []);

  const setIsAuthenticated = useCallback((nextValue) => {
    setIsAuthenticatedState((prev) => {
      const resolved = typeof nextValue === 'function' ? nextValue(prev) : nextValue;
      const normalized = Boolean(resolved);
      storage.setJSON(STORAGE_KEYS.isAuthenticated, normalized);
      return normalized;
    });
  }, []);

  const setDemoRole = useCallback((nextRole) => {
    const normalized = normalizeRole(nextRole);
    setDemoRoleState(normalized);
    storage.setString(STORAGE_KEYS.demoRole, normalized);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isAuthenticated,
      setIsAuthenticated,
      demoRole,
      setDemoRole,
      isHydrated,
    }),
    [
      language,
      setLanguage,
      toggleLanguage,
      isAuthenticated,
      setIsAuthenticated,
      demoRole,
      setDemoRole,
      isHydrated,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
};
