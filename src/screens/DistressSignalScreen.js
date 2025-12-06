import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';
import { useRoute } from '@react-navigation/native';

const DISTRESS = [
  {
    id: 'd1',
    type: 'sos',
    geo: 'Sector 62, Noida',
    date: '2025-02-10',
    time: '10:20',
    feedback: 'Team dispatched',
  },
  {
    id: 'd2',
    type: 'media',
    geo: 'Dwarka, Delhi',
    date: '2025-02-09',
    time: '19:00',
    mediaType: 'Image',
    feedback: 'Verifying clip',
  },
  {
    id: 'd3',
    type: 'sos',
    geo: 'Haridwar, Uttarakhand',
    date: '2025-02-08',
    time: '08:30',
    feedback: 'Under review',
  },
  {
    id: 'd4',
    type: 'media',
    geo: 'Agra, Uttar Pradesh',
    date: '2025-02-06',
    time: '16:15',
    mediaType: 'Audio',
    feedback: 'Routing to helpline',
  },
];

export const DistressSignalScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.params?.initialTab ?? 'sos');
  const [selectedId, setSelectedId] = useState(DISTRESS[0]?.id);

  const items = useMemo(
    () => DISTRESS.filter((d) => d.type === (activeTab === 'media' ? 'media' : 'sos')),
    [activeTab],
  );
  const selected = items.find((d) => d.id === selectedId) ?? items[0];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.distress.title}</Text>
      <View style={styles.tabRow}>
        {[
          { key: 'sos', label: strings.distress.tabs.sos },
          { key: 'media', label: strings.distress.tabs.media },
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
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { fontFamily: typography.semibold },
                  active && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.layout}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: Spacing.lg, gap: Spacing.sm }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.card, selected?.id === item.id && styles.cardActive]}
              activeOpacity={0.9}
              onPress={() => setSelectedId(item.id)}
            >
              <Text style={[styles.count, { fontFamily: typography.bold }]}>{index + 1}.</Text>
              <View style={{ flex: 1, gap: Spacing.xs, paddingLeft: Spacing.xs }}>
                <Text style={[styles.metaTitle, { fontFamily: typography.semibold }]}>
                  {item.geo}
                </Text>
                <Text style={[styles.meta, { fontFamily: typography.regular }]}>
                  {strings.distress.detail.date}: {item.date}
                </Text>
                <Text style={[styles.meta, { fontFamily: typography.regular }]}>
                  {strings.distress.detail.time}: {item.time}
                </Text>
                {item.mediaType ? (
                  <Text style={[styles.meta, { fontFamily: typography.regular }]}>
                    {strings.distress.detail.mediaType}: {item.mediaType}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => null}
        />

        {selected ? (
          <View style={styles.detail}>
            <Text style={[styles.detailLine, { fontFamily: typography.semibold }]}>
              {strings.distress.detail.date}: {selected.date}
            </Text>
            <Text style={[styles.detailLine, { fontFamily: typography.semibold }]}>
              {strings.distress.detail.time}: {selected.time}
            </Text>
            <Text style={[styles.detailLine, { fontFamily: typography.semibold }]}>
              {strings.distress.detail.geo}: {selected.geo}
            </Text>
            {selected.mediaType ? (
              <Text style={[styles.detailLine, { fontFamily: typography.semibold }]}>
                {strings.distress.detail.mediaType}: {selected.mediaType}
              </Text>
            ) : null}
            <Text style={[styles.detailLine, { fontFamily: typography.semibold }]}>
              {strings.distress.detail.feedback}: {selected.feedback}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EAD4BC',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabLabel: {
    color: Colors.textPrimary,
  },
  tabLabelActive: {
    color: '#fff',
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  list: {
    flex: 1.1,
  },
  card: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E4B67A',
  },
  cardActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  count: {
    fontSize: 16,
    color: Colors.primary,
    width: 20,
  },
  metaTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  meta: {
    color: Colors.textPrimary,
    fontSize: 12.5,
    lineHeight: 18,
  },
  detail: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E4B67A',
    padding: Spacing.md,
    backgroundColor: '#fff',
  },
  detailLine: {
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
});
