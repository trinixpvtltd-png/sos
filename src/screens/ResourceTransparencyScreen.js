import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';

const ENTRIES = [
  { id: 'u1', mode: 'used', for: 'Medical tents', date: '2025-02-10', time: '10:20' },
  { id: 'u2', mode: 'used', for: 'Food kits', date: '2025-02-08', time: '18:30' },
  { id: 'r1', mode: 'received', for: 'Donor drop', date: '2025-02-07', time: '12:00' },
  { id: 'res1', mode: 'reservoir', for: 'Buffer stock', date: '2025-02-05', time: '09:20' },
];

export const ResourceTransparencyScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const [mode, setMode] = useState('used');
  const [activeId, setActiveId] = useState(ENTRIES[0].id);

  const items = useMemo(() => ENTRIES.filter((i) => i.mode === mode), [mode]);
  const selected = items.find((i) => i.id === activeId) ?? items[0];

  const tabs = [
    { key: 'used', label: strings.resourcesHandle.used },
    { key: 'received', label: strings.resourcesHandle.received },
    { key: 'reservoir', label: strings.resourcesHandle.reservoir },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { fontFamily: typography.bold }]}>
        {strings.resourcesHandle.title}
      </Text>
      <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>
        {strings.resourcesHandle.subtitle}
      </Text>

      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const active = tab.key === mode;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => {
                setMode(tab.key);
                setActiveId(undefined);
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

      <View style={styles.panel}>
        <Text style={[styles.panelTitle, { fontFamily: typography.semibold }]}>List</Text>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: Spacing.sm }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.card, selected?.id === item.id && styles.cardActive]}
              onPress={() => setActiveId(item.id)}
              activeOpacity={0.9}
            >
              <Text style={[styles.count, { fontFamily: typography.bold }]}>{index + 1}.</Text>
              <View>
                <Text style={[styles.meta, { fontFamily: typography.semibold }]}>To: {item.for}</Text>
                <Text style={[styles.meta, { fontFamily: typography.regular }]}>
                  Date/Time: {item.date} {item.time}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {selected ? (
        <View style={styles.detail}>
          <Text style={[styles.meta, { fontFamily: typography.semibold }]}>Amount: —</Text>
          <Text style={[styles.meta, { fontFamily: typography.semibold }]}>Type: {mode}</Text>
          <Text style={[styles.meta, { fontFamily: typography.regular }]}>
            Description: {selected.for}
          </Text>
        </View>
      ) : null}
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
    fontSize: 20,
    color: Colors.textPrimary,
  },
  subtitle: {
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E4B67A',
    backgroundColor: '#fff',
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
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#E4B67A',
  },
  panelTitle: {
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#F0D9BF',
    backgroundColor: '#F9E9D8',
  },
  cardActive: {
    borderColor: Colors.primary,
  },
  count: {
    color: Colors.primary,
    width: 24,
  },
  meta: {
    color: Colors.textPrimary,
  },
  detail: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E4B67A',
    backgroundColor: '#fff',
  },
});
