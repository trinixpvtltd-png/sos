import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultContacts } from '../data/contacts';
import { STORAGE_KEYS } from '../storage/keys';
import { storage } from '../storage/storage';

const ContactsContext = createContext();

const normalizePhone = (value = '') => String(value).replace(/[^\d+]/g, '');

const getInitialContacts = (savedContacts) => (
  Array.isArray(savedContacts) && savedContacts.length > 0 ? savedContacts : defaultContacts
);

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState(defaultContacts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const savedContacts = await storage.getJSON(STORAGE_KEYS.contacts, defaultContacts);
        if (!mounted) {
          return;
        }
        setContacts(getInitialContacts(savedContacts));
      } catch (storageError) {
        if (mounted) {
          setError('Unable to load emergency contacts.');
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

  const persistContacts = useCallback((nextContacts) => {
    setContacts(nextContacts);
    storage.setJSON(STORAGE_KEYS.contacts, nextContacts);
  }, []);

  const addContact = useCallback((contactInput) => {
    const nextContact = {
      id: contactInput.id || `ct-${Date.now()}`,
      name: contactInput.name || '',
      phone: contactInput.phone || '',
      alternatePhone: contactInput.alternatePhone || '',
      relation: contactInput.relation || 'Other',
      priority: contactInput.priority || 'Medium',
      isActiveForSos: Boolean(contactInput.isActiveForSos),
      notes: contactInput.notes || '',
    };

    setContacts((prev) => {
      const next = [nextContact, ...prev];
      storage.setJSON(STORAGE_KEYS.contacts, next);
      return next;
    });

    return nextContact;
  }, []);

  const updateContact = useCallback((contactId, updates) => {
    setContacts((prev) => {
      const next = prev.map((contact) => (
        contact.id === contactId ? { ...contact, ...updates } : contact
      ));
      storage.setJSON(STORAGE_KEYS.contacts, next);
      return next;
    });
  }, []);

  const deleteContact = useCallback((contactId) => {
    setContacts((prev) => {
      const next = prev.filter((contact) => contact.id !== contactId);
      storage.setJSON(STORAGE_KEYS.contacts, next);
      return next;
    });
  }, []);

  const toggleContactActive = useCallback((contactId) => {
    setContacts((prev) => {
      const next = prev.map((contact) => (
        contact.id === contactId
          ? { ...contact, isActiveForSos: !contact.isActiveForSos }
          : contact
      ));
      storage.setJSON(STORAGE_KEYS.contacts, next);
      return next;
    });
  }, []);

  const findDuplicatePhone = useCallback((phone, ignoreId) => {
    const normalizedTarget = normalizePhone(phone);
    if (!normalizedTarget) {
      return null;
    }

    return contacts.find((contact) => (
      contact.id !== ignoreId &&
      normalizePhone(contact.phone) === normalizedTarget
    ));
  }, [contacts]);

  const activeContacts = useMemo(
    () => contacts.filter((contact) => contact.isActiveForSos),
    [contacts],
  );

  const value = useMemo(() => ({
    contacts,
    activeContacts,
    setContacts: persistContacts,
    addContact,
    updateContact,
    deleteContact,
    toggleContactActive,
    findDuplicatePhone,
    isLoading,
    error,
    setError,
  }), [
    contacts,
    activeContacts,
    persistContacts,
    addContact,
    updateContact,
    deleteContact,
    toggleContactActive,
    findDuplicatePhone,
    isLoading,
    error,
  ]);

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
};

export const useContactsContext = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContactsContext must be used inside ContactsProvider');
  }
  return context;
};
