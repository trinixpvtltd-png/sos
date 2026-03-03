import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useIncidentsContext } from '../context/IncidentsContext';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { StatusChip } from '../components/StatusChip';
import { TimelineList } from '../components/TimelineList';

export const CaseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const typography = useTypography();
  const strings = useStrings();
  const {
    getIncidentById,
    getTimelineByIncidentId,
    getNotificationStatusesByIncidentId,
  } = useIncidentsContext();

  const incidentId = route.params?.incidentId;
  const incident = getIncidentById(incidentId);
  const timeline = getTimelineByIncidentId(incidentId);
  const notificationStatuses = getNotificationStatusesByIncidentId(incidentId);

  if (!incident) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={{ padding: Spacing.lg }}>
            <EmptyStateCard
              icon="file-text"
              title={strings.caseDetail.notFoundTitle}
              description={strings.caseDetail.notFoundDescription}
              actionLabel={strings.common.back}
              onAction={() => navigation.goBack()}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.caseDetail.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{incident.id}</Text>
          </View>
          <StatusChip status={incident.status} label={incident.status} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Section title={strings.caseDetail.headerLabel}>
            <DetailRow label={strings.caseDetail.type} value={incident.type} />
            <DetailRow label={strings.caseDetail.status} value={incident.status} />
            <DetailRow label={strings.caseDetail.date} value={new Date(incident.createdAt).toLocaleString()} />
          </Section>

          <Section title={strings.caseDetail.locationTitle}>
            <Text style={[styles.detailText, { fontFamily: typography.regular }]}>{incident.location?.text}</Text>
            <Text style={[styles.detailMeta, { fontFamily: typography.regular }]}>
              {incident.location?.latitude}, {incident.location?.longitude}
            </Text>
          </Section>

          <Section title={strings.caseDetail.contactsTitle}>
            <DetailRow
              label={strings.caseDetail.notifiedCount}
              value={String(incident.contactsNotifiedCount || notificationStatuses.length)}
            />
            {notificationStatuses.map((item) => (
              <View style={styles.statusRow} key={item.id}>
                <Text style={[styles.detailText, { fontFamily: typography.regular }]}>{item.contactName}</Text>
                <StatusChip status={item.status} label={item.status} />
              </View>
            ))}
          </Section>

          <Section title={strings.caseDetail.attachmentsTitle}>
            <DetailRow label={strings.caseDetail.attachmentsCount} value={String(incident.attachmentsCount || 0)} />
          </Section>

          <Section title={strings.caseDetail.timelineTitle}>
            <TimelineList items={timeline} />
          </Section>

          <Section title={strings.caseDetail.notesTitle}>
            <Text style={[styles.detailText, { fontFamily: typography.regular }]}> {incident.description || strings.common.notAvailable}</Text>
            {incident.resolutionNote ? (
              <Text style={[styles.detailMeta, { fontFamily: typography.regular }]}>
                {strings.caseDetail.resolutionNote}: {incident.resolutionNote}
              </Text>
            ) : null}
          </Section>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const Section = ({ title, children }) => {
  const typography = useTypography();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>{title}</Text>
      {children}
    </View>
  );
};

const DetailRow = ({ label, value }) => {
  const typography = useTypography();
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { fontFamily: typography.regular }]}>{label}</Text>
      <Text style={[styles.detailValue, { fontFamily: typography.semibold }]}>{value}</Text>
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
    borderWidth: 1,
    borderColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 90,
    gap: 10,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFEFF2',
    paddingTop: 8,
  },
  detailLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  detailValue: {
    color: Colors.textPrimary,
    fontSize: 13,
  },
  detailText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  detailMeta: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EFEFF2',
    paddingTop: 8,
  },
});
