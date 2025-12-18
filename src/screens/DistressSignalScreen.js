import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';
import { useRoute } from '@react-navigation/native';
import { useBreakpoints } from '../hooks';

const DISTRESS = [
  {
    id: 'd1',
    type: 'sos',
    geo: 'Sector 62, Noida',
    date: '2025-02-10',
    time: '10:20',
    feedback: 'Rescue team arrived at location.',
    status: 'Active',
  },
  {
    id: 'd2',
    type: 'media',
    geo: 'Dwarka, Delhi',
    date: '2025-02-09',
    time: '19:00',
    mediaType: 'Image',
    feedback: 'Report verified by local authorities.',
    status: 'Closed',
  },
  {
    id: 'd3',
    type: 'sos',
    geo: 'Haridwar, Uttarakhand',
    date: '2025-02-08',
    time: '08:30',
    feedback: 'Incident reported. Waiting for dispatch.',
    status: 'Pending',
  },
  {
    id: 'd4',
    type: 'media',
    geo: 'Agra, Uttar Pradesh',
    date: '2025-02-06',
    time: '16:15',
    mediaType: 'Audio',
    feedback: 'Audio clip analyzed for threats.',
    status: 'Active',
  },
];

export const DistressSignalScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const route = useRoute();
  const { isMdUp } = useBreakpoints();
  const [activeTab, setActiveTab] = useState(route.params?.initialTab ?? 'sos');
  const [selectedId, setSelectedId] = useState(DISTRESS[0]?.id);

  const items = useMemo(
    () => DISTRESS.filter((d) => d.type === (activeTab === 'media' ? 'media' : 'sos')),
    [activeTab],
  );
  const selected = items.find((d) => d.id === selectedId) || items[0];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { fontFamily: typography.bold }]}>Activity Log</Text>
          <TouchableOpacity style={styles.refreshBtn}>
            <Feather name="rotate-cw" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <View style={styles.tabBar}>
            {[
              { key: 'sos', label: 'SOS Signals', icon: 'alert-octagon' },
              { key: 'media', label: 'Reports', icon: 'file-text' },
            ].map((tab) => {
              const active = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, active && styles.tabActive]}
                  onPress={() => {
                    setActiveTab(tab.key);
                    setSelectedId(undefined);
                  }}
                >
                  <Feather name={tab.icon} size={18} color={active ? '#fff' : Colors.textSecondary} />
                  <Text style={[styles.tabLabel, { fontFamily: typography.semibold, color: active ? '#fff' : Colors.textSecondary }]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.layout, !isMdUp && styles.layoutStack]}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.card, selected?.id === item.id && styles.cardActive]}
                activeOpacity={0.8}
                onPress={() => setSelectedId(item.id)}
              >
                <View style={styles.cardIndicator} />
                <View style={{ flex: 1 }}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardId, { fontFamily: typography.bold }]}>#{item.id.toUpperCase()}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(item.status), fontFamily: typography.semibold }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.metaTitle, { fontFamily: typography.semibold }]} numberOfLines={1}>
                    {item.geo}
                  </Text>
                  <View style={styles.metaRow}>
                    <Feather name="calendar" size={12} color={Colors.textMuted} />
                    <Text style={[styles.meta, { fontFamily: typography.regular }]}>{item.date}</Text>
                    <Feather name="clock" size={12} color={Colors.textMuted} style={{ marginLeft: 12 }} />
                    <Text style={[styles.meta, { fontFamily: typography.regular }]}>{item.time}</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color={Colors.border} />
              </TouchableOpacity>
            )}
          />

          {!isMdUp && selected && (
            <View style={styles.detailDrawer}>
              <View style={styles.detailHeader}>
                <Text style={[styles.detailTitle, { fontFamily: typography.bold }]}>Details</Text>
              </View>
              <ScrollView contentContainerStyle={styles.detailScroll}>
                <DetailItem label="Location" value={selected.geo} icon="map-pin" typography={typography} />
                <DetailItem label="Timestamp" value={`${selected.date} at ${selected.time}`} icon="clock" typography={typography} />
                {selected.mediaType && <DetailItem label="Report Type" value={selected.mediaType} icon="file" typography={typography} />}
                <View style={styles.feedbackBox}>
                  <Text style={[styles.feedbackLabel, { fontFamily: typography.semibold }]}>Response Details</Text>
                  <Text style={[styles.feedbackText, { fontFamily: typography.regular }]}>{selected.feedback}</Text>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const DetailItem = ({ label, value, icon, typography }) => (
  <View style={styles.detailItem}>
    <View style={styles.detailIconBox}>
      <Feather name={icon} size={18} color={Colors.primary} />
    </View>
    <View>
      <Text style={[styles.detailLabel, { fontFamily: typography.regular }]}>{label}</Text>
      <Text style={[styles.detailValue, { fontFamily: typography.semibold }]}>{value}</Text>
    </View>
  </View>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return Colors.primary;
    case 'Closed': return Colors.success;
    case 'Pending': return Colors.warning;
    default: return Colors.textSecondary;
  }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
  refreshBtn: {
    padding: 8,
  },
  tabContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 14,
  },
  layout: {
    flex: 1,
  },
  layoutStack: {
    flexDirection: 'column',
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: Colors.primary + '30',
    backgroundColor: Colors.primary + '05',
  },
  cardIndicator: {
    width: 4,
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginRight: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardId: {
    fontSize: 12,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  metaTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    color: Colors.textMuted,
    fontSize: 12,
    marginLeft: 4,
  },
  detailDrawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: '40%',
  },
  detailHeader: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  detailScroll: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  feedbackBox: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  feedbackLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

