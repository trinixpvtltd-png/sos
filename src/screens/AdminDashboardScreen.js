import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useAppContext } from '../context/AppContext';

const moderationQueue = [
  { id: 'MOD-101', type: 'Report', reason: 'Graphic content review', status: 'Pending' },
  { id: 'MOD-102', type: 'Spectator Alert', reason: 'Duplicate incident', status: 'Escalated' },
];

const ngoVerificationList = [
  { id: 'NGO-V-11', name: 'Community Aid Front', state: 'Delhi', status: 'Pending Docs' },
  { id: 'NGO-V-12', name: 'SafeTransit Trust', state: 'UP', status: 'Under Review' },
];

const flaggedContent = [
  { id: 'FG-90', summary: 'Potential misinformation in relief campaign post' },
  { id: 'FG-91', summary: 'Sensitive victim identity exposed in report attachment' },
];

export const AdminDashboardScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const { setDemoRole } = useAppContext();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.dashboard.admin.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.dashboard.admin.subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.roleBtn} onPress={() => setDemoRole('citizen')}>
            <Feather name="arrow-left" size={16} color={Colors.textPrimary} />
            <Text style={[styles.roleBtnText, { fontFamily: typography.semibold }]}>{strings.dashboard.backToCitizen}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.metricsRow}>
            <MetricCard label={strings.dashboard.admin.metrics.pending} value="26" />
            <MetricCard label={strings.dashboard.admin.metrics.verifiedNgos} value="84" />
            <MetricCard label={strings.dashboard.admin.metrics.flagged} value="9" />
          </View>

          <Section title={strings.dashboard.admin.moderationTitle}>
            {moderationQueue.map((item) => (
              <RowItem
                key={item.id}
                title={`${item.id} - ${item.type}`}
                subtitle={item.reason}
                status={item.status}
              />
            ))}
          </Section>

          <Section title={strings.dashboard.admin.verificationTitle}>
            {ngoVerificationList.map((item) => (
              <RowItem
                key={item.id}
                title={`${item.name} (${item.state})`}
                subtitle={item.id}
                status={item.status}
              />
            ))}
          </Section>

          <Section title={strings.dashboard.admin.flaggedTitle}>
            {flaggedContent.map((item) => (
              <View key={item.id} style={styles.simpleRow}>
                <Text style={[styles.rowTitle, { fontFamily: typography.semibold }]}>{item.id}</Text>
                <Text style={[styles.rowSubtitle, { fontFamily: typography.regular }]}>{item.summary}</Text>
              </View>
            ))}
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

const RowItem = ({ title, subtitle, status }) => {
  const typography = useTypography();

  return (
    <View style={styles.simpleRow}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, { fontFamily: typography.semibold }]}>{title}</Text>
        <Text style={[styles.rowSubtitle, { fontFamily: typography.regular }]}>{subtitle}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={[styles.badgeText, { fontFamily: typography.semibold }]}>{status}</Text>
      </View>
    </View>
  );
};

const MetricCard = ({ label, value }) => {
  const typography = useTypography();
  return (
    <View style={styles.metricCard}>
      <Text style={[styles.metricLabel, { fontFamily: typography.regular }]}>{label}</Text>
      <Text style={[styles.metricValue, { fontFamily: typography.bold }]}>{value}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 90,
    gap: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 10,
    gap: 4,
  },
  metricLabel: { color: Colors.textMuted, fontSize: 11 },
  metricValue: { color: Colors.textPrimary, fontSize: 14 },
  section: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 12,
    gap: 8,
  },
  sectionTitle: { color: Colors.textPrimary, fontSize: 14 },
  simpleRow: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFF2',
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowTitle: { color: Colors.textPrimary, fontSize: 13 },
  rowSubtitle: { color: Colors.textSecondary, fontSize: 12, flex: 1 },
  badge: {
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}10`,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  badgeText: { color: Colors.primary, fontSize: 11 },
});
