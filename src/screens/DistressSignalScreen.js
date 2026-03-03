import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useIncidentsContext } from '../context/IncidentsContext';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { LoadingSkeletonCard } from '../components/LoadingSkeletonCard';
import { StatusChip } from '../components/StatusChip';

const TYPE_FILTERS = ['All', 'SOS', 'Spectator Alert', 'Report'];

export const DistressSignalScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { groupedIncidents, isLoading, isOfflineLike } = useIncidentsContext();

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

      const blob = `${incident.id} ${incident.type} ${incident.description} ${incident.location?.text}`.toLowerCase();
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
          <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.distress.titleNew}</Text>
          <TouchableOpacity style={styles.refreshBtn}>
            <Feather name="refresh-cw" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <SearchFilterBar
          searchValue={searchQuery}
          onChangeSearch={setSearchQuery}
          searchPlaceholder={strings.distress.searchPlaceholder}
          filters={TYPE_FILTERS}
          selectedFilter={typeFilter}
          onSelectFilter={setTypeFilter}
        />

        {isOfflineLike ? (
          <View style={styles.banner}>
            <Feather name="wifi-off" size={14} color={Colors.warning} />
            <Text style={[styles.bannerText, { fontFamily: typography.semibold }]}>{strings.common.offlineMode}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <LoadingSkeletonCard lines={3} />
            <LoadingSkeletonCard lines={2} />
            <LoadingSkeletonCard lines={3} />
          </View>
        ) : isEmpty ? (
          <View style={styles.emptyWrap}>
            <EmptyStateCard
              icon="clock"
              title={strings.distress.emptyTitle}
              description={strings.distress.emptyDescription}
            />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <IncidentSection
              title={strings.distress.activeGroup}
              incidents={sections.active}
              navigation={navigation}
            />
            <IncidentSection
              title={strings.distress.recentGroup}
              incidents={sections.recent}
              navigation={navigation}
            />
            <IncidentSection
              title={strings.distress.olderGroup}
              incidents={sections.older}
              navigation={navigation}
            />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const IncidentSection = ({ title, incidents, navigation }) => {
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
          <View style={styles.cardHeader}>
            <Text style={[styles.caseId, { fontFamily: typography.semibold }]}>{incident.id}</Text>
            <StatusChip status={incident.status} label={incident.status} />
          </View>
          <View style={styles.tagRow}>
            <StatusChip status={incident.type} label={incident.type} />
          </View>
          <Text style={[styles.cardText, { fontFamily: typography.regular }]} numberOfLines={2}>{incident.description}</Text>
          <View style={styles.metaRow}>
            <Feather name="map-pin" size={12} color={Colors.textMuted} />
            <Text style={[styles.metaText, { fontFamily: typography.regular }]} numberOfLines={1}>{incident.location?.text}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  banner: {
    marginHorizontal: Spacing.lg,
    marginBottom: 6,
    padding: 8,
    borderRadius: Radius.md,
    backgroundColor: '#FFF8E7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerText: {
    color: '#A87000',
    fontSize: 12,
  },
  loadingWrap: {
    paddingHorizontal: Spacing.lg,
    gap: 10,
  },
  emptyWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  caseId: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cardText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 12,
  },
});
