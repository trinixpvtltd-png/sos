import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';

const ENTRIES = [
  { id: 'u1', mode: 'used', label: 'Medical tents', date: '2025-02-10', time: '10:20' },
  { id: 'u2', mode: 'used', label: 'Food kits', date: '2025-02-08', time: '18:30' },
  { id: 'r1', mode: 'received', label: 'Donor drop', date: '2025-02-07', time: '12:00' },
  { id: 'res1', mode: 'reservoir', label: 'Buffer stock', date: '2025-02-05', time: '09:20' },
];

const normalizeMode = (mode) => (
  ['used', 'received', 'reservoir'].includes(mode) ? mode : 'used'
);

export const ResourceTransparencyPanel = ({ initialMode }) => {
  const typography = useTypography();
  const strings = useStrings();
  const normalizedInitialMode = normalizeMode(initialMode);
  const [mode, setMode] = useState(normalizedInitialMode);
  const [activeId, setActiveId] = useState(ENTRIES[0]?.id);

  useEffect(() => {
    setMode(normalizedInitialMode);
    setActiveId(undefined);
  }, [normalizedInitialMode]);

  const items = useMemo(() => ENTRIES.filter((entry) => entry.mode === mode), [mode]);
  const selected = items.find((entry) => entry.id === activeId) ?? items[0];

  const tabs = [
    { key: 'used', label: strings.resourcesHandle.used },
    { key: 'received', label: strings.resourcesHandle.received },
    { key: 'reservoir', label: strings.resourcesHandle.reservoir },
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, { fontFamily: typography.bold }]}>
        {strings.resourcesHandle.title}
      </Text>
      <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>
        {strings.resourcesHandle.subtitle}
      </Text>

      <View style={styles.tabRail}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          alwaysBounceHorizontal={false}
          contentContainerStyle={styles.tabRow}
        >
          {tabs.map((tab) => {
            const isActive = tab.key === mode;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => {
                  setMode(tab.key);
                  setActiveId(undefined);
                }}
                activeOpacity={0.9}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabLabel,
                    { fontFamily: typography.semibold },
                    isActive && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.panel}>
        <Text style={[styles.panelTitle, { fontFamily: typography.semibold }]}>List</Text>
        <View style={styles.list}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, selected?.id === item.id && styles.cardActive]}
              onPress={() => setActiveId(item.id)}
              activeOpacity={0.9}
            >
              <Text style={[styles.count, { fontFamily: typography.bold }]}>{index + 1}.</Text>
              <View style={styles.cardBody}>
                <Text style={[styles.meta, { fontFamily: typography.semibold }]}>To: {item.label}</Text>
                <Text style={[styles.meta, { fontFamily: typography.regular }]}>
                  Date/Time: {item.date} {item.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selected ? (
        <View style={styles.detail}>
          <Text style={[styles.meta, { fontFamily: typography.semibold }]}>Amount: N/A</Text>
          <Text style={[styles.meta, { fontFamily: typography.semibold }]}>Type: {mode}</Text>
          <Text style={[styles.meta, { fontFamily: typography.regular }]}>
            Description: {selected.label}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.lg,
  },
  title: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  tabRail: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#F4D9BA',
    backgroundColor: '#FFF7EE',
    padding: 12,
    overflow: 'hidden',
  },
  tabRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  tab: {
    minWidth: 132,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#EBC89D',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  tabLabel: {
    color: '#3A2E24',
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#fff',
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#F1D4B2',
    gap: Spacing.sm,
  },
  panelTitle: {
    color: Colors.textPrimary,
  },
  list: {
    gap: Spacing.sm,
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
  cardBody: {
    flex: 1,
    gap: 2,
  },
  meta: {
    color: Colors.textPrimary,
  },
  detail: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#F1D4B2',
    backgroundColor: '#fff',
    gap: 4,
  },
});
