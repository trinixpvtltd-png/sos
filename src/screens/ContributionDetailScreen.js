import { useEffect, useMemo, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';

const CONTRIBUTIONS = [
  { id: 'c1', mode: 'made', title: 'Medical kits supplied', date: '2025-02-10', amount: '₹12,000' },
  { id: 'c2', mode: 'received', title: 'Donation received', date: '2025-02-11', amount: '₹22,500' },
  { id: 'c3', mode: 'made', title: 'Food packets delivered', date: '2025-02-08', amount: '₹8,200' },
];

export const ContributionDetailScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const route = useRoute();
  const initialMode = route.params?.mode ?? 'made';
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (route.params?.mode && route.params.mode !== mode) {
      setMode(route.params.mode);
    }
  }, [route.params?.mode]);

  const items = useMemo(() => CONTRIBUTIONS.filter((c) => c.mode === mode), [mode]);

  const tabs = [
    { key: 'made', label: strings.contributions.made },
    { key: 'received', label: strings.contributions.received },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { fontFamily: typography.bold }]}>Contribution Detail</Text>
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const active = tab.key === mode;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setMode(tab.key)}
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
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: Spacing.sm }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{item.title}</Text>
            <Text style={[styles.meta, { fontFamily: typography.regular }]}>{item.date}</Text>
            <Text style={[styles.meta, { fontFamily: typography.semibold }]}>{item.amount}</Text>
          </View>
        )}
      />
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
  card: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E4B67A',
  },
  cardTitle: {
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  meta: {
    color: Colors.textMuted,
  },
});
