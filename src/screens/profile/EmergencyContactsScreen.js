import React, { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';
import { useContactsContext } from '../../context/ContactsContext';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { ContactCard } from '../../components/ContactCard';
import { EmptyStateCard } from '../../components/EmptyStateCard';
import { LoadingSkeletonCard } from '../../components/LoadingSkeletonCard';

const FILTERS = ['All', 'Active', 'Family', 'Friend', 'Guardian', 'Police'];

export const EmergencyContactsScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const {
    contacts,
    isLoading,
    error,
    deleteContact,
    toggleContactActive,
  } = useContactsContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return contacts.filter((contact) => {
      const relation = String(contact.relation || '').toLowerCase();
      const matchesFilter =
        selectedFilter === 'All' ||
        (selectedFilter === 'Active' ? contact.isActiveForSos : relation === selectedFilter.toLowerCase());

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchBlob = `${contact.name} ${contact.phone} ${contact.relation}`.toLowerCase();
      return searchBlob.includes(query);
    });
  }, [contacts, searchQuery, selectedFilter]);

  const handleDelete = (contact) => {
    Alert.alert(
      strings.contacts.deleteTitle,
      strings.contacts.deleteMessage.replace('{name}', contact.name),
      [
        { text: strings.common.cancel, style: 'cancel' },
        {
          text: strings.common.delete,
          style: 'destructive',
          onPress: () => deleteContact(contact.id),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.contacts.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>
              {strings.contacts.subtitle}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('AddEditEmergencyContact', { mode: 'add' })}
          >
            <Feather name="plus" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <SearchFilterBar
          searchValue={searchQuery}
          onChangeSearch={setSearchQuery}
          searchPlaceholder={strings.contacts.searchPlaceholder}
          filters={FILTERS}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />

        {error ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={16} color={Colors.primary} />
            <Text style={[styles.errorText, { fontFamily: typography.regular }]}>{error}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <LoadingSkeletonCard lines={2} />
            <LoadingSkeletonCard lines={3} />
            <LoadingSkeletonCard lines={2} />
          </View>
        ) : (
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ContactCard
                contact={item}
                onEdit={() => navigation.navigate('AddEditEmergencyContact', {
                  mode: 'edit',
                  contactId: item.id,
                })}
                onDelete={() => handleDelete(item)}
                onToggle={toggleContactActive}
              />
            )}
            ListEmptyComponent={(
              <EmptyStateCard
                icon="users"
                title={strings.contacts.emptyTitle}
                description={strings.contacts.emptyDescription}
                actionLabel={strings.contacts.addCta}
                onAction={() => navigation.navigate('AddEditEmergencyContact', { mode: 'add' })}
              />
            )}
          />
        )}

        {!isLoading && filteredContacts.length > 0 ? (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('AddEditEmergencyContact', { mode: 'add' })}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={[styles.fabLabel, { fontFamily: typography.semibold }]}>{strings.contacts.addCta}</Text>
          </TouchableOpacity>
        ) : null}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  title: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: -2,
  },
  errorBox: {
    marginHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}12`,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 12,
  },
  loadingWrap: {
    paddingHorizontal: Spacing.lg,
    gap: 12,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
    gap: 12,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  fabLabel: {
    color: '#fff',
    fontSize: 13,
  },
});
