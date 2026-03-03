import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultPermissionsStatus } from '../data/permissionsStatus';
import { defaultSafetySettings, safetyDefaults } from '../data/safetySettings';
import { STORAGE_KEYS } from '../storage/keys';
import { storage } from '../storage/storage';
import { useAppContext } from './AppContext';
import { useContactsContext } from './ContactsContext';

const SafetyContext = createContext();

const getMergedPermissions = (savedPermissions) => {
  if (!savedPermissions || typeof savedPermissions !== 'object') {
    return defaultPermissionsStatus;
  }

  const merged = {};
  Object.keys(defaultPermissionsStatus).forEach((key) => {
    merged[key] = {
      ...defaultPermissionsStatus[key],
      ...savedPermissions[key],
    };
  });
  return merged;
};

const getMergedSettings = (savedSettings) => ({
  ...defaultSafetySettings,
  ...(savedSettings && typeof savedSettings === 'object' ? savedSettings : {}),
});

export const SafetyProvider = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  const { activeContacts } = useContactsContext();

  const [safetySettings, setSafetySettings] = useState(defaultSafetySettings);
  const [permissionStatuses, setPermissionStatuses] = useState(defaultPermissionsStatus);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const [savedSettings, savedPermissions] = await Promise.all([
          storage.getJSON(STORAGE_KEYS.safetySettings, defaultSafetySettings),
          storage.getJSON(STORAGE_KEYS.permissionStatuses, defaultPermissionsStatus),
        ]);

        if (!mounted) {
          return;
        }

        setSafetySettings(getMergedSettings(savedSettings));
        setPermissionStatuses(getMergedPermissions(savedPermissions));
      } catch (storageError) {
        if (mounted) {
          setError('Unable to load safety configuration.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  const updateSafetySettings = useCallback((updates) => {
    setSafetySettings((prev) => {
      const next = {
        ...prev,
        ...(typeof updates === 'function' ? updates(prev) : updates),
      };
      storage.setJSON(STORAGE_KEYS.safetySettings, next);
      return next;
    });
  }, []);

  const resetSafetySettings = useCallback(() => {
    setSafetySettings(safetyDefaults);
    storage.setJSON(STORAGE_KEYS.safetySettings, safetyDefaults);
  }, []);

  const setPermissionStatus = useCallback((permissionKey, enabled) => {
    setPermissionStatuses((prev) => {
      const next = {
        ...prev,
        [permissionKey]: {
          ...(prev[permissionKey] || {}),
          enabled: Boolean(enabled),
        },
      };
      storage.setJSON(STORAGE_KEYS.permissionStatuses, next);
      return next;
    });
  }, []);

  const togglePermissionStatus = useCallback((permissionKey) => {
    setPermissionStatuses((prev) => {
      const currentValue = prev[permissionKey]?.enabled;
      const next = {
        ...prev,
        [permissionKey]: {
          ...(prev[permissionKey] || {}),
          enabled: !currentValue,
        },
      };
      storage.setJSON(STORAGE_KEYS.permissionStatuses, next);
      return next;
    });
  }, []);

  const readinessChecklist = useMemo(() => {
    const micEnabled = Boolean(permissionStatuses.microphone?.enabled);
    const cameraEnabled = Boolean(permissionStatuses.camera?.enabled);

    return [
      {
        key: 'profileCompleted',
        label: 'profileCompleted',
        complete: Boolean(isAuthenticated),
        required: true,
      },
      {
        key: 'contactsAdded',
        label: 'contactsAdded',
        complete: activeContacts.length > 0,
        required: true,
      },
      {
        key: 'locationPermission',
        label: 'locationPermission',
        complete: Boolean(permissionStatuses.location?.enabled),
        required: true,
      },
      {
        key: 'notificationsPermission',
        label: 'notificationsPermission',
        complete: Boolean(permissionStatuses.notifications?.enabled),
        required: true,
      },
      {
        key: 'micCameraOptional',
        label: 'micCameraOptional',
        complete: micEnabled || cameraEnabled,
        required: false,
      },
    ];
  }, [isAuthenticated, activeContacts.length, permissionStatuses]);

  const readinessProgress = useMemo(() => {
    const completedCount = readinessChecklist.filter((item) => item.complete).length;
    return {
      completedCount,
      totalCount: readinessChecklist.length,
      percent: Math.round((completedCount / readinessChecklist.length) * 100),
    };
  }, [readinessChecklist]);

  const value = useMemo(() => ({
    safetySettings,
    updateSafetySettings,
    resetSafetySettings,
    permissionStatuses,
    setPermissionStatus,
    togglePermissionStatus,
    readinessChecklist,
    readinessProgress,
    isLoading,
    error,
    setError,
  }), [
    safetySettings,
    updateSafetySettings,
    resetSafetySettings,
    permissionStatuses,
    setPermissionStatus,
    togglePermissionStatus,
    readinessChecklist,
    readinessProgress,
    isLoading,
    error,
  ]);

  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
};

export const useSafetyContext = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafetyContext must be used inside SafetyProvider');
  }
  return context;
};
