import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { defaultAuthorityQueue } from '../data/authorityQueue';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useBreakpoints } from '../hooks';
import { useAppContext } from '../context/AppContext';
import { StatusChip } from '../components/StatusChip';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { EmptyStateCard } from '../components/EmptyStateCard';

const FILTERS = ['All', 'New', 'Urgent', 'Assigned', 'Resolved'];

export const AuthorityDashboardScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const { isMdUp } = useBreakpoints();
  const { setDemoRole } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [queue, setQueue] = useState(defaultAuthorityQueue);
  const [selectedCaseId, setSelectedCaseId] = useState(defaultAuthorityQueue[0]?.id);

  const filteredQueue = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return queue.filter((item) => {
      const matchesFilter =
        selectedFilter === 'All' ||
        item.status === selectedFilter ||
        item.priority === selectedFilter;

      if (!matchesFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const blob = `${item.caseId} ${item.location} ${item.summary}`.toLowerCase();
      return blob.includes(query);
    });
  }, [queue, searchQuery, selectedFilter]);

  const selectedCase = filteredQueue.find((item) => item.id === selectedCaseId) || filteredQueue[0];

  const updateStatus = (status) => {
    if (!selectedCase) {
      return;
    }

    setQueue((prev) => prev.map((item) => (
      item.id === selectedCase.id ? { ...item, status } : item
    )));
    setSelectedCaseId(selectedCase.id);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.dashboard.authority.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.dashboard.authority.subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.roleBtn} onPress={() => setDemoRole('citizen')}>
            <Feather name="arrow-left" size={16} color={Colors.textPrimary} />
            <Text style={[styles.roleBtnText, { fontFamily: typography.semibold }]}>{strings.dashboard.backToCitizen}</Text>
          </TouchableOpacity>
        </View>

        <SearchFilterBar
          searchValue={searchQuery}
          onChangeSearch={setSearchQuery}
          searchPlaceholder={strings.dashboard.authority.searchPlaceholder}
          filters={FILTERS}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />

        {filteredQueue.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyStateCard
              icon="inbox"
              title={strings.dashboard.authority.emptyTitle}
              description={strings.dashboard.authority.emptyDescription}
            />
          </View>
        ) : isMdUp ? (
          <View style={styles.splitLayout}>
            <View style={styles.queuePane}>
              <FlatList
                data={filteredQueue}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.queueCard, selectedCase?.id === item.id && styles.queueCardActive]}
                    onPress={() => setSelectedCaseId(item.id)}
                  >
                    <View style={styles.queueHead}>
                      <Text style={[styles.caseId, { fontFamily: typography.semibold }]}>{item.caseId}</Text>
                      <StatusChip status={item.status} label={item.status} />
                    </View>
                    <Text style={[styles.caseSummary, { fontFamily: typography.regular }]} numberOfLines={2}>{item.summary}</Text>
                    <Text style={[styles.caseMeta, { fontFamily: typography.regular }]}>{item.location}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.detailPane}>
              {selectedCase ? (
                <CaseDetailPanel
                  caseItem={selectedCase}
                  onUpdateStatus={updateStatus}
                  strings={strings}
                />
              ) : null}
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.mobileContent}>
            {filteredQueue.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.queueCard}
                onPress={() => setSelectedCaseId(item.id)}
              >
                <View style={styles.queueHead}>
                  <Text style={[styles.caseId, { fontFamily: typography.semibold }]}>{item.caseId}</Text>
                  <StatusChip status={item.status} label={item.status} />
                </View>
                <Text style={[styles.caseSummary, { fontFamily: typography.regular }]} numberOfLines={2}>{item.summary}</Text>
                <Text style={[styles.caseMeta, { fontFamily: typography.regular }]}>{item.location}</Text>
                {selectedCaseId === item.id ? (
                  <CaseDetailPanel
                    caseItem={item}
                    onUpdateStatus={updateStatus}
                    strings={strings}
                    compact
                  />
                ) : null}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const CaseDetailPanel = ({ caseItem, onUpdateStatus, strings, compact }) => {
  const typography = useTypography();

  return (
    <View style={[styles.panel, compact && { marginTop: 10 }]}> 
      <Text style={[styles.panelTitle, { fontFamily: typography.bold }]}>{caseItem.caseId}</Text>
      <Text style={[styles.panelMeta, { fontFamily: typography.regular }]}>{caseItem.location}</Text>
      <Text style={[styles.panelSummary, { fontFamily: typography.regular }]}>{caseItem.summary}</Text>

      <View style={styles.actionsWrap}>
        {[
          { key: 'Assigned', label: strings.dashboard.authority.actions.accept },
          { key: 'En Route', label: strings.dashboard.authority.actions.enRoute },
          { key: 'On Scene', label: strings.dashboard.authority.actions.onScene },
          { key: 'Resolved', label: strings.dashboard.authority.actions.resolved },
        ].map((action) => (
          <TouchableOpacity
            key={action.key}
            style={styles.panelAction}
            onPress={() => onUpdateStatus(action.key)}
          >
            <Text style={[styles.panelActionText, { fontFamily: typography.semibold }]}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.proofBtn}>
        <Feather name="upload" size={14} color={Colors.primary} />
        <Text style={[styles.proofText, { fontFamily: typography.semibold }]}>
          {strings.dashboard.authority.actions.uploadProof}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { fontSize: 26, color: Colors.textPrimary },
  subtitle: { color: Colors.textMuted, fontSize: 13 },
  roleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  roleBtnText: { color: Colors.textPrimary, fontSize: 12 },
  splitLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 16,
  },
  queuePane: {
    flex: 1,
  },
  detailPane: {
    width: 360,
  },
  queueCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 12,
    gap: 6,
  },
  queueCardActive: {
    borderColor: `${Colors.primary}44`,
    backgroundColor: `${Colors.primary}08`,
  },
  queueHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  caseId: {
    color: Colors.textPrimary,
    fontSize: 13,
  },
  caseSummary: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  caseMeta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 14,
    gap: 8,
  },
  panelTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
  },
  panelMeta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  panelSummary: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  actionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  panelAction: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    backgroundColor: '#F6F6F8',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  panelActionText: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  proofBtn: {
    marginTop: 4,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}12`,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  proofText: {
    color: Colors.primary,
    fontSize: 12,
  },
  mobileContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 90,
    gap: 8,
  },
  emptyWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 6,
  },
});
