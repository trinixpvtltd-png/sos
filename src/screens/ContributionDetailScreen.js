import { useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';

const CONTRIBUTIONS = [
  { id: 'c1', mode: 'made', title: 'Medical kits supplied', date: '10 Feb 2025', amount: '₹12,000', icon: 'medical-bag' },
  { id: 'c2', mode: 'received', title: 'Donation received', date: '11 Feb 2025', amount: '₹22,500', icon: 'hand-heart' },
  { id: 'c3', mode: 'made', title: 'Food packets delivered', date: '08 Feb 2025', amount: '₹8,200', icon: 'food-apple' },
];

const ContributionCard = ({ item, typography }) => (
  <View style={styles.card}>
    <View style={styles.cardIconBox}>
      <MaterialCommunityIcons name={item.icon || 'gift'} size={24} color={Colors.primary} />
    </View>
    <View style={styles.cardInfo}>
      <Text style={[styles.cardTitle, { fontFamily: typography.bold }]}>{item.title}</Text>
      <Text style={[styles.cardDate, { fontFamily: typography.regular }]}>{item.date}</Text>
    </View>
    <View style={styles.cardAmount}>
      <Text style={[styles.amountText, { fontFamily: typography.bold }]}>{item.amount}</Text>
    </View>
  </View>
);

export const ContributionDetailScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const navigation = useNavigation();
  const route = useRoute();
  const initialMode = route.params?.mode ?? 'made';
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (route.params?.mode && route.params.mode !== mode) {
      setMode(route.params.mode);
    }
  }, [route.params?.mode]);

  const items = useMemo(() => CONTRIBUTIONS.filter((c) => c.mode === mode), [mode]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>Financial Records</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>Contributions & Support history</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabItem, mode === 'made' && styles.tabItemActive]}
            onPress={() => setMode('made')}
          >
            <Text style={[styles.tabLabel, { fontFamily: typography.semibold }, mode === 'made' && styles.tabLabelActive]}>
              Sent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, mode === 'received' && styles.tabItemActive]}
            onPress={() => setMode('received')}
          >
            <Text style={[styles.tabLabel, { fontFamily: typography.semibold }, mode === 'received' && styles.tabLabelActive]}>
              Received
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ContributionCard item={item} typography={typography} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="history" size={64} color={Colors.textMuted} />
              <Text style={[styles.emptyText, { fontFamily: typography.semibold }]}>No records found</Text>
            </View>
          )}
        />
      </SafeAreaView>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: 30,
    paddingBottom: Spacing.md,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: -2,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  tabItemActive: {
    backgroundColor: Colors.textPrimary,
  },
  tabLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: '#fff',
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  cardIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  cardAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textMuted,
  }
});
