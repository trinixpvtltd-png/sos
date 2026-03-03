import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { defaultNgoCampaigns } from '../data/ngoCampaigns';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useAppContext } from '../context/AppContext';

export const NgoDashboardScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const { setDemoRole } = useAppContext();

  const totalRaised = defaultNgoCampaigns.campaigns.reduce((sum, item) => sum + item.raised, 0);
  const totalGoal = defaultNgoCampaigns.campaigns.reduce((sum, item) => sum + item.goal, 0);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.dashboard.ngo.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.dashboard.ngo.subtitle}</Text>
          </View>
          <TouchableOpacity style={styles.roleBtn} onPress={() => setDemoRole('citizen')}>
            <Feather name="arrow-left" size={16} color={Colors.textPrimary} />
            <Text style={[styles.roleBtnText, { fontFamily: typography.semibold }]}>{strings.dashboard.backToCitizen}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.metricsRow}>
            <MetricCard label={strings.dashboard.ngo.metrics.raised} value={`Rs ${totalRaised.toLocaleString()}`} />
            <MetricCard label={strings.dashboard.ngo.metrics.goal} value={`Rs ${totalGoal.toLocaleString()}`} />
            <MetricCard label={strings.dashboard.ngo.metrics.campaigns} value={String(defaultNgoCampaigns.campaigns.length)} />
          </View>

          <Section title={strings.dashboard.ngo.campaignsTitle}>
            {defaultNgoCampaigns.campaigns.map((campaign) => (
              <View key={campaign.id} style={styles.card}>
                <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{campaign.title}</Text>
                <Text style={[styles.cardMeta, { fontFamily: typography.regular }]}>{campaign.region} - {campaign.status}</Text>
                <Text style={[styles.cardText, { fontFamily: typography.regular }]}>
                  Rs {campaign.raised.toLocaleString()} / Rs {campaign.goal.toLocaleString()}
                </Text>
                <Text style={[styles.cardMeta, { fontFamily: typography.regular }]}>
                  {campaign.beneficiaries} beneficiaries
                </Text>
              </View>
            ))}
          </Section>

          <Section title={strings.dashboard.ngo.aidTitle}>
            {defaultNgoCampaigns.aidRequests.map((aid) => (
              <View key={aid.id} style={styles.rowCard}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{aid.title}</Text>
                  <Text style={[styles.cardMeta, { fontFamily: typography.regular }]}>{aid.count} open requests</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={[styles.tagText, { fontFamily: typography.semibold }]}>{aid.severity}</Text>
                </View>
              </View>
            ))}
          </Section>

          <Section title={strings.dashboard.ngo.impactTitle}>
            {defaultNgoCampaigns.impactFeed.map((feed) => (
              <View key={feed.id} style={styles.card}>
                <Text style={[styles.cardText, { fontFamily: typography.regular }]}>{feed.text}</Text>
                <Text style={[styles.cardMeta, { fontFamily: typography.regular }]}>{new Date(feed.date).toLocaleString()}</Text>
              </View>
            ))}
          </Section>
        </ScrollView>
      </SafeAreaView>
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

const Section = ({ title, children }) => {
  const typography = useTypography();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>{title}</Text>
      {children}
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
  card: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFF2',
    paddingTop: 8,
    gap: 2,
  },
  rowCard: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFF2',
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: { color: Colors.textPrimary, fontSize: 13 },
  cardMeta: { color: Colors.textMuted, fontSize: 11 },
  cardText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18 },
  tag: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  tagText: {
    color: Colors.primary,
    fontSize: 11,
  },
});
