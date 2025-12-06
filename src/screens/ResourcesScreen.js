import { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useStrings } from '../localization/useStrings';
import { resources } from '../data/resources';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

const categories = ['All', ...new Set(resources.map((item) => item.category))];

const ResourceCard = ({ item, typography }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.badge}>
        <Text style={[styles.badgeLabel, { fontFamily: typography.semibold }]}>{item.category}</Text>
      </View>
      <View style={styles.region}>
        <Feather name="map-pin" size={14} color={Colors.primary} />
        <Text style={[styles.regionLabel, { fontFamily: typography.regular }]}>{item.region}</Text>
      </View>
    </View>
    <Text style={[styles.cardTitle, { fontFamily: typography.bold }]}>{item.title}</Text>
    <Text style={[styles.cardDescription, { fontFamily: typography.regular }]}>{item.description}</Text>
    <View style={styles.metaRow}>
      <Feather name="phone" size={16} color={Colors.textMuted} />
      <Text style={[styles.metaText, { fontFamily: typography.semibold }]}>{item.contact}</Text>
    </View>
    <Text style={[styles.escalation, { fontFamily: typography.regular }]}>{item.escalation}</Text>
  </View>
);

export const ResourcesScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredResources = useMemo(() => {
    if (activeCategory === 'All') {
      return resources;
    }
    return resources.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.chipLabel,
                  { fontFamily: typography.semibold },
                  active && styles.chipLabelActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.quickRow}>
        <TouchableOpacity
          style={styles.quick}
          onPress={() => navigation.navigate('ResourceTransparency')}
          activeOpacity={0.9}
        >
          <Text style={[styles.quickLabel, { fontFamily: typography.semibold }]}>Resource Handle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quick}
          onPress={() => navigation.navigate('AvailableService')}
          activeOpacity={0.9}
        >
          <Text style={[styles.quickLabel, { fontFamily: typography.semibold }]}>Available Service</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={filteredResources}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>
            {strings.navigation.resources}
          </Text>
        )}
        renderItem={({ item }) => <ResourceCard item={item} typography={typography} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  chipRow: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quick: {
    flex: 1,
    backgroundColor: '#F2D9BB',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  quickLabel: {
    color: Colors.textPrimary,
  },
  chip: {
    minWidth: 82,
    minHeight: 36,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.lg,
    backgroundColor: '#F7E9D8',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipLabel: {
    fontSize: 14,
    lineHeight: 18,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  chipLabelActive: {
    color: '#fff',
  },
  list: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: 26,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: '#fff',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: '#FDEFE3',
  },
  badgeLabel: {
    fontSize: 12,
    color: Colors.primary,
  },
  region: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  regionLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  cardTitle: {
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  metaText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  escalation: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  separator: {
    height: Spacing.xl,
  },
});
