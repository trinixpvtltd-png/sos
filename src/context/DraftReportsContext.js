import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultDraftReports } from '../data/draftReports';
import { STORAGE_KEYS } from '../storage/keys';
import { storage } from '../storage/storage';

const DraftReportsContext = createContext();

const mergeDraft = (existingDraft, payload) => ({
  ...existingDraft,
  ...payload,
  updatedAt: new Date().toISOString(),
});

export const DraftReportsProvider = ({ children }) => {
  const [draftReports, setDraftReports] = useState(defaultDraftReports);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const savedDrafts = await storage.getJSON(STORAGE_KEYS.draftReports, defaultDraftReports);

        if (!mounted) {
          return;
        }

        if (Array.isArray(savedDrafts)) {
          setDraftReports(savedDrafts);
        }
      } catch (storageError) {
        if (mounted) {
          setError('Unable to load saved drafts.');
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

  const persistDrafts = useCallback((nextDrafts) => {
    setDraftReports(nextDrafts);
    storage.setJSON(STORAGE_KEYS.draftReports, nextDrafts);
  }, []);

  const saveDraft = useCallback((draftPayload) => {
    const draftId = draftPayload.id || `DR-${Date.now()}`;
    let savedDraft;

    setDraftReports((prev) => {
      const existingIndex = prev.findIndex((draft) => draft.id === draftId);
      let next;

      if (existingIndex >= 0) {
        savedDraft = mergeDraft(prev[existingIndex], { ...draftPayload, id: draftId });
        next = [...prev];
        next[existingIndex] = savedDraft;
      } else {
        savedDraft = {
          id: draftId,
          category: draftPayload.category || 'Other',
          severity: draftPayload.severity || 'Low',
          anonymity: Boolean(draftPayload.anonymity),
          includeLocation: Boolean(draftPayload.includeLocation),
          title: draftPayload.title || '',
          description: draftPayload.description || '',
          attachments: Array.isArray(draftPayload.attachments) ? draftPayload.attachments : [],
          status: draftPayload.status || 'Draft',
          updatedAt: new Date().toISOString(),
        };
        next = [savedDraft, ...prev];
      }

      storage.setJSON(STORAGE_KEYS.draftReports, next);
      return next;
    });

    return savedDraft;
  }, []);

  const deleteDraft = useCallback((draftId) => {
    setDraftReports((prev) => {
      const next = prev.filter((draft) => draft.id !== draftId);
      storage.setJSON(STORAGE_KEYS.draftReports, next);
      return next;
    });
  }, []);

  const updateDraftStatus = useCallback((draftId, status) => {
    setDraftReports((prev) => {
      const next = prev.map((draft) => (
        draft.id === draftId
          ? { ...draft, status, updatedAt: new Date().toISOString() }
          : draft
      ));
      storage.setJSON(STORAGE_KEYS.draftReports, next);
      return next;
    });
  }, []);

  const getDraftById = useCallback(
    (draftId) => draftReports.find((draft) => draft.id === draftId),
    [draftReports],
  );

  const value = useMemo(() => ({
    draftReports,
    setDraftReports: persistDrafts,
    saveDraft,
    deleteDraft,
    updateDraftStatus,
    getDraftById,
    isLoading,
    error,
    setError,
  }), [
    draftReports,
    persistDrafts,
    saveDraft,
    deleteDraft,
    updateDraftStatus,
    getDraftById,
    isLoading,
    error,
  ]);

  return <DraftReportsContext.Provider value={value}>{children}</DraftReportsContext.Provider>;
};

export const useDraftReportsContext = () => {
  const context = useContext(DraftReportsContext);
  if (!context) {
    throw new Error('useDraftReportsContext must be used inside DraftReportsProvider');
  }
  return context;
};
