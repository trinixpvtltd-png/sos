import { useMemo, useState, useCallback } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStrings } from '../localization/useStrings';
import { resources } from '../data/resources';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { SearchFilterBar } from '../components/SearchFilterBar';

const ResourceCard = ({ item, typography }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.7}>
    <View style={styles.cardHeader}>
      <View style={[styles.badge, { backgroundColor: item.category === 'Medical' || item.category === 'Helpline' ? '#F2F9F2' : '#F0F7FF' }]}>
        <Text style={[styles.badgeLabel, {
          fontFamily: typography.semibold,
          color: item.category === 'Medical' || item.category === 'Helpline' ? Colors.success : Colors.info
        }]}>
          {item.category}
        </Text>
      </View>
      <View style={styles.region}>
        <Feather name="map-pin" size={14} color={Colors.textSecondary} />
        <Text style={[styles.regionLabel, { fontFamily: typography.regular }]}>{item.region}</Text>
      </View>
    </View>

    <Text style={[styles.cardTitle, { fontFamily: typography.bold }]}>{item.title}</Text>
    <Text style={[styles.cardDescription, { fontFamily: typography.regular }]} numberOfLines={2}>
      {item.description}
    </Text>

    <View style={styles.cardFooter}>
      <View style={styles.contactInfo}>
        <Feather name="phone" size={16} color={Colors.primary} />
        <Text style={[styles.metaText, { fontFamily: typography.semibold }]}>{item.contact}</Text>
      </View>
      <TouchableOpacity style={styles.callButton}>
        <Feather name="external-link" size={18} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const QuickLinkCard = ({ label, icon, onPress, typography }) => {
  const words = label.split(' ');
  const firstLine = words[0];
  const secondLine = words.slice(1).join(' ');

  return (
    <TouchableOpacity style={styles.quickLinkItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.quickLinkIconBox}>
        <Feather name={icon} size={20} color="#333" />
      </View>
      <View style={styles.quickLinkTextContainer}>
        <Text style={[styles.quickLinkLabel, { fontFamily: typography.bold }]}>{firstLine}</Text>
        <Text style={[styles.quickLinkLabel, { fontFamily: typography.bold }]}>{secondLine}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const ResourcesScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      // Reset filters when screen comes into focus
      setActiveCategory('All');
      setSearchQuery('');
    }, [])
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(resources.map((r) => r.category).filter(Boolean)));
    unique.sort((a, b) => String(a).localeCompare(String(b)));
    return ['All', ...unique];
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Sticky Section */}
        <View style={styles.stickyHeader}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>Resources</Text>
              <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>Safety tools and assistance</Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          {/* Quick Links Section */}
          <View style={styles.quickLinksSection}>
            <View style={styles.quickLinksRow}>
              <QuickLinkCard
                label="Resource Handle"
                icon="check-circle"
                onPress={() => navigation.navigate('Home', { screen: 'ResourceTransparency' })}
                typography={typography}
              />
              <QuickLinkCard
                label="Available Service"
                icon="briefcase"
                onPress={() => navigation.navigate('Home', { screen: 'AvailableService' })}
                typography={typography}
              />
            </View>
          </View>

          <SearchFilterBar
            searchValue={searchQuery}
            onChangeSearch={setSearchQuery}
            searchPlaceholder="Search resources, police..."
            filters={categories}
            selectedFilter={activeCategory}
            onSelectFilter={setActiveCategory}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* Resources List */}
          <View style={styles.listSection}>
            {filteredResources.map((item) => (
              <ResourceCard key={item.id} item={item} typography={typography} />
            ))}
            {filteredResources.length === 0 && (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="text-search" size={64} color={Colors.textSecondary} />
                <Text style={[styles.emptyText, { fontFamily: typography.regular }]}>
                  No resources found matching your criteria.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 30,
    paddingBottom: Spacing.xs,
  },
  stickyHeader: {
    backgroundColor: Colors.background,
    zIndex: 10,
    paddingBottom: Spacing.xs,
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
  sectionTitle: {
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 16,
    paddingHorizontal: Spacing.lg,
  },
  quickLinksSection: {
    marginTop: 10,
  },
  quickLinksRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  quickLinkItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  quickLinkIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  quickLinkLabel: {
    fontSize: 13,
    color: '#3A3A3C',
    lineHeight: 16,
  },
  listSection: {
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  region: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  regionLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardTitle: {
    fontSize: 19,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  callButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});



