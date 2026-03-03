import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultIncidentTimeline } from '../data/incidentTimeline';
import { defaultIncidents } from '../data/incidents';
import { defaultNotificationStatuses } from '../data/notificationStatuses';
import { STORAGE_KEYS } from '../storage/keys';
import { storage } from '../storage/storage';
import { useContactsContext } from './ContactsContext';

const IncidentsContext = createContext();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createIncidentId = () => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INC-${yy}${mm}${dd}-${random}`;
};

const mergeSavedState = (savedState) => {
  if (!savedState || typeof savedState !== 'object') {
    return {
      incidents: defaultIncidents,
      notificationStatuses: defaultNotificationStatuses,
      timelineByIncident: defaultIncidentTimeline,
      sosFlowState: 'idle',
      activeIncidentId: null,
    };
  }

  return {
    incidents: Array.isArray(savedState.incidents) ? savedState.incidents : defaultIncidents,
    notificationStatuses: Array.isArray(savedState.notificationStatuses)
      ? savedState.notificationStatuses
      : defaultNotificationStatuses,
    timelineByIncident: savedState.timelineByIncident && typeof savedState.timelineByIncident === 'object'
      ? savedState.timelineByIncident
      : defaultIncidentTimeline,
    sosFlowState: savedState.sosFlowState || 'idle',
    activeIncidentId: savedState.activeIncidentId || null,
  };
};

const createNotificationItems = (incidentId, contacts) => {
  const channels = ['SMS', 'Push', 'Voice'];

  return contacts.map((contact, index) => {
    const statusByIndex = index % 3 === 0 ? 'success' : index % 3 === 1 ? 'pending' : 'failed';

    return {
      id: `ns-${incidentId}-${contact.id}`,
      incidentId,
      contactId: contact.id,
      contactName: contact.name,
      channel: channels[index % channels.length],
      status: statusByIndex,
      updatedAt: new Date().toISOString(),
      retryable: statusByIndex !== 'success',
    };
  });
};

const buildTimelineEntry = ({ title, description, status = 'done' }) => ({
  id: `tl-${Date.now()}-${Math.floor(Math.random() * 99)}`,
  title,
  description,
  status,
  timestamp: new Date().toISOString(),
});

const getMockLocation = () => ({
  text: 'Current location (mock): Sector 62, Noida',
  latitude: 28.6272,
  longitude: 77.3722,
});

export const IncidentsProvider = ({ children }) => {
  const { activeContacts } = useContactsContext();

  const [incidents, setIncidents] = useState(defaultIncidents);
  const [notificationStatuses, setNotificationStatuses] = useState(defaultNotificationStatuses);
  const [timelineByIncident, setTimelineByIncident] = useState(defaultIncidentTimeline);
  const [sosFlowState, setSosFlowState] = useState('idle');
  const [activeIncidentId, setActiveIncidentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOfflineLike, setIsOfflineLike] = useState(false);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const savedState = await storage.getJSON(STORAGE_KEYS.incidentsState, null);
        const normalized = mergeSavedState(savedState);

        if (!mounted) {
          return;
        }

        setIncidents(normalized.incidents);
        setNotificationStatuses(normalized.notificationStatuses);
        setTimelineByIncident(normalized.timelineByIncident);
        setSosFlowState(normalized.sosFlowState);
        setActiveIncidentId(normalized.activeIncidentId);
      } catch (storageError) {
        if (mounted) {
          setError('Unable to load local incident history.');
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

  useEffect(() => {
    if (isLoading) {
      return;
    }

    storage.setJSON(STORAGE_KEYS.incidentsState, {
      incidents,
      notificationStatuses,
      timelineByIncident,
      sosFlowState,
      activeIncidentId,
    });
  }, [
    incidents,
    notificationStatuses,
    timelineByIncident,
    sosFlowState,
    activeIncidentId,
    isLoading,
  ]);

  const appendTimelineEntry = useCallback((incidentId, entry) => {
    setTimelineByIncident((prev) => ({
      ...prev,
      [incidentId]: [...(prev[incidentId] || []), entry],
    }));
  }, []);

  const createSosIncident = useCallback(async ({
    description,
    silentMode,
    fakeCallUsed,
  } = {}) => {
    const incidentId = createIncidentId();
    const notifiedContacts = activeContacts.filter((contact) => contact.isActiveForSos);
    const statuses = createNotificationItems(incidentId, notifiedContacts);
    const nowIso = new Date().toISOString();

    const newIncident = {
      id: incidentId,
      type: 'SOS',
      sourceType: 'citizen',
      status: 'Sending',
      createdAt: nowIso,
      updatedAt: nowIso,
      location: getMockLocation(),
      description: description || 'Emergency signal triggered from SOS button.',
      contactsNotifiedCount: notifiedContacts.length,
      attachmentsCount: 0,
      silentMode: Boolean(silentMode),
      fakeCallUsed: Boolean(fakeCallUsed),
    };

    setSosFlowState('sending');

    setIncidents((prev) => [newIncident, ...prev]);
    setNotificationStatuses((prev) => [...statuses, ...prev]);
    setTimelineByIncident((prev) => ({
      ...prev,
      [incidentId]: [
        buildTimelineEntry({
          title: 'SOS activated',
          description: 'Long press confirmed and countdown completed.',
        }),
        buildTimelineEntry({
          title: 'Alerts dispatch started',
          description: `Notifying ${notifiedContacts.length} active contacts.`,
          status: 'active',
        }),
      ],
    }));

    await wait(1400);

    const activatedAt = new Date().toISOString();
    setIncidents((prev) => prev.map((incident) => (
      incident.id === incidentId
        ? { ...incident, status: 'Tracking Active', updatedAt: activatedAt }
        : incident
    )));

    appendTimelineEntry(incidentId, buildTimelineEntry({
      title: 'Tracking active',
      description: 'Live incident mode enabled with location stream (mock).',
      status: 'done',
    }));

    setActiveIncidentId(incidentId);
    setSosFlowState('active');

    return {
      incidentId,
    };
  }, [activeContacts, appendTimelineEntry]);

  const updateIncidentStatus = useCallback((incidentId, status) => {
    setIncidents((prev) => prev.map((incident) => (
      incident.id === incidentId
        ? { ...incident, status, updatedAt: new Date().toISOString() }
        : incident
    )));
  }, []);

  const resolveIncident = useCallback((incidentId, note) => {
    updateIncidentStatus(incidentId, 'Resolved');
    setIncidents((prev) => prev.map((incident) => (
      incident.id === incidentId
        ? { ...incident, resolutionNote: note || '', updatedAt: new Date().toISOString() }
        : incident
    )));

    appendTimelineEntry(incidentId, buildTimelineEntry({
      title: 'Incident resolved',
      description: note || 'User confirmed they are safe now.',
      status: 'done',
    }));

    if (activeIncidentId === incidentId) {
      setActiveIncidentId(null);
      setSosFlowState('resolved');
      setTimeout(() => setSosFlowState('idle'), 300);
    }
  }, [activeIncidentId, appendTimelineEntry, updateIncidentStatus]);

  const escalateIncident = useCallback((incidentId) => {
    updateIncidentStatus(incidentId, 'Waiting Response');
    appendTimelineEntry(incidentId, buildTimelineEntry({
      title: 'Escalation requested',
      description: 'Incident priority elevated for additional response.',
      status: 'active',
    }));
  }, [appendTimelineEntry, updateIncidentStatus]);

  const addIncidentAttachment = useCallback((incidentId, attachmentType) => {
    setIncidents((prev) => prev.map((incident) => (
      incident.id === incidentId
        ? {
          ...incident,
          attachmentsCount: Number(incident.attachmentsCount || 0) + 1,
          updatedAt: new Date().toISOString(),
        }
        : incident
    )));

    appendTimelineEntry(incidentId, buildTimelineEntry({
      title: `Evidence added (${attachmentType})`,
      description: `Mock ${attachmentType} evidence captured locally.`,
      status: 'done',
    }));
  }, [appendTimelineEntry]);

  const retryNotification = useCallback((notificationId) => {
    setNotificationStatuses((prev) => prev.map((notification) => (
      notification.id === notificationId
        ? {
          ...notification,
          status: 'pending',
          updatedAt: new Date().toISOString(),
        }
        : notification
    )));

    setTimeout(() => {
      setNotificationStatuses((prev) => prev.map((notification) => (
        notification.id === notificationId
          ? {
            ...notification,
            status: 'success',
            updatedAt: new Date().toISOString(),
            retryable: false,
          }
          : notification
      )));
    }, 1100);
  }, []);

  const createSpectatorIncident = useCallback((payload) => {
    const incidentId = createIncidentId();
    const nowIso = new Date().toISOString();

    const newIncident = {
      id: incidentId,
      type: 'Spectator Alert',
      sourceType: 'spectator',
      status: 'Alert Sent',
      createdAt: nowIso,
      updatedAt: nowIso,
      location: payload.includeLocation ? getMockLocation() : { text: 'Location not shared' },
      description: payload.description || payload.type || 'Spectator alert submitted.',
      contactsNotifiedCount: 0,
      attachmentsCount: Array.isArray(payload.attachments) ? payload.attachments.length : 0,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setTimelineByIncident((prev) => ({
      ...prev,
      [incidentId]: [
        buildTimelineEntry({
          title: 'Spectator alert submitted',
          description: payload.type || 'Emergency reported for another person.',
        }),
        buildTimelineEntry({
          title: 'Dispatcher queue updated',
          description: 'Local queue entry created for frontend demo.',
          status: 'active',
        }),
      ],
    }));

    return incidentId;
  }, []);

  const createReportIncident = useCallback((payload) => {
    const incidentId = createIncidentId();
    const nowIso = new Date().toISOString();

    const newIncident = {
      id: incidentId,
      type: 'Report',
      sourceType: 'revelation',
      status: 'Waiting Response',
      createdAt: nowIso,
      updatedAt: nowIso,
      location: payload.includeLocation ? getMockLocation() : { text: 'Location not included' },
      description: payload.description || '',
      contactsNotifiedCount: 0,
      attachmentsCount: Array.isArray(payload.attachments) ? payload.attachments.length : 0,
      title: payload.title || '',
      category: payload.category || 'Other',
      severity: payload.severity || 'Low',
      anonymity: Boolean(payload.anonymity),
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setTimelineByIncident((prev) => ({
      ...prev,
      [incidentId]: [
        buildTimelineEntry({
          title: 'Report received',
          description: 'Revelation report saved locally with case ID.',
        }),
        buildTimelineEntry({
          title: 'Pending review',
          description: 'Mock moderation queue awaiting assignment.',
          status: 'active',
        }),
      ],
    }));

    return incidentId;
  }, []);

  const getIncidentById = useCallback(
    (incidentId) => incidents.find((incident) => incident.id === incidentId),
    [incidents],
  );

  const getTimelineByIncidentId = useCallback(
    (incidentId) => timelineByIncident[incidentId] || [],
    [timelineByIncident],
  );

  const getNotificationStatusesByIncidentId = useCallback(
    (incidentId) => notificationStatuses.filter((item) => item.incidentId === incidentId),
    [notificationStatuses],
  );

  const groupedIncidents = useMemo(() => {
    const now = Date.now();
    const twoDays = 2 * 24 * 60 * 60 * 1000;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return incidents.reduce((groups, incident) => {
      const createdAt = new Date(incident.createdAt).getTime();
      const age = now - createdAt;
      const isActive = ['Sending', 'Alert Sent', 'Tracking Active', 'Waiting Response'].includes(incident.status);

      if (isActive) {
        groups.active.push(incident);
      } else if (age <= sevenDays) {
        groups.recent.push(incident);
      } else {
        groups.older.push(incident);
      }

      return groups;
    }, {
      active: [],
      recent: [],
      older: [],
    });
  }, [incidents]);

  const value = useMemo(() => ({
    incidents,
    groupedIncidents,
    notificationStatuses,
    timelineByIncident,
    sosFlowState,
    setSosFlowState,
    activeIncidentId,
    setActiveIncidentId,
    createSosIncident,
    resolveIncident,
    escalateIncident,
    addIncidentAttachment,
    retryNotification,
    createSpectatorIncident,
    createReportIncident,
    getIncidentById,
    getTimelineByIncidentId,
    getNotificationStatusesByIncidentId,
    updateIncidentStatus,
    isLoading,
    error,
    setError,
    isOfflineLike,
    setIsOfflineLike,
  }), [
    incidents,
    groupedIncidents,
    notificationStatuses,
    timelineByIncident,
    sosFlowState,
    activeIncidentId,
    createSosIncident,
    resolveIncident,
    escalateIncident,
    addIncidentAttachment,
    retryNotification,
    createSpectatorIncident,
    createReportIncident,
    getIncidentById,
    getTimelineByIncidentId,
    getNotificationStatusesByIncidentId,
    updateIncidentStatus,
    isLoading,
    error,
    isOfflineLike,
  ]);

  return <IncidentsContext.Provider value={value}>{children}</IncidentsContext.Provider>;
};

export const useIncidentsContext = () => {
  const context = useContext(IncidentsContext);
  if (!context) {
    throw new Error('useIncidentsContext must be used inside IncidentsProvider');
  }
  return context;
};
