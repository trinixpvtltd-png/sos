import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';
import { useIncidentsContext } from '../../context/IncidentsContext';
import { SearchFilterBar } from '../../components/SearchFilterBar';
import { EmptyStateCard } from '../../components/EmptyStateCard';
import { StatusChip } from '../../components/StatusChip';

const TYPE_FILTERS = ['All', 'SOS', 'Spectator Alert', 'Report'];

export const DistressHistoryScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { groupedIncidents } = useIncidentsContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const applyFilters = (list = []) => {
    const query = searchQuery.trim().toLowerCase();

    return list.filter((incident) => {
      const matchesType = typeFilter === 'All' || incident.type === typeFilter;
      if (!matchesType) {
        return false;
      }
      if (!query) {
        return true;
      }
      const blob = `${incident.id} ${incident.type} ${incident.description}`.toLowerCase();
      return blob.includes(query);
    });
  };

  const sections = useMemo(() => ({
    active: applyFilters(groupedIncidents.active),
    recent: applyFilters(groupedIncidents.recent),
    older: applyFilters(groupedIncidents.older),
  }), [groupedIncidents, searchQuery, typeFilter]);

  const isEmpty = !sections.active.length && !sections.recent.length && !sections.older.length;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>{strings.distress.historyTitle}</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>{strings.distress.historySubtitle}</Text>
          </View>
        </View>

        <SearchFilterBar
          searchValue={searchQuery}
          onChangeSearch={setSearchQuery}
          searchPlaceholder={strings.distress.searchPlaceholder}
          filters={TYPE_FILTERS}
          selectedFilter={typeFilter}
          onSelectFilter={setTypeFilter}
        />

        {isEmpty ? (
          <View style={styles.emptyWrap}>
            <EmptyStateCard
              icon="history"
              title={strings.distress.emptyTitle}
              description={strings.distress.emptyDescription}
            />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Section title={strings.distress.activeGroup} incidents={sections.active} navigation={navigation} />
            <Section title={strings.distress.recentGroup} incidents={sections.recent} navigation={navigation} />
            <Section title={strings.distress.olderGroup} incidents={sections.older} navigation={navigation} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const Section = ({ title, incidents, navigation }) => {
  const typography = useTypography();

  if (!incidents.length) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { fontFamily: typography.bold }]}>{title}</Text>
      {incidents.map((incident) => (
        <TouchableOpacity
          key={incident.id}
          style={styles.card}
          onPress={() => navigation.navigate('CaseDetail', { incidentId: incident.id })}
        >
          <View style={styles.cardHead}>
            <Text style={[styles.caseId, { fontFamily: typography.semibold }]}>{incident.id}</Text>
            <StatusChip status={incident.status} label={incident.status} />
          </View>
          <View style={styles.tags}>
            <StatusChip status={incident.type} label={incident.type} />
          </View>
          <Text style={[styles.cardText, { fontFamily: typography.regular }]} numberOfLines={2}>{incident.description}</Text>
          <Text style={[styles.meta, { fontFamily: typography.regular }]}>{new Date(incident.createdAt).toLocaleString()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  emptyWrap: {
    paddingHorizontal: Spacing.lg,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 95,
    gap: 10,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 12,
    gap: 6,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  caseId: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  cardText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
