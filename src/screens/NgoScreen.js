import { BlurView } from 'expo-blur';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState, useCallback } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';
import { NGO_LEVELS, ngos } from '../data/ngos';
import { SearchFilterBar } from '../components/SearchFilterBar';

const levelOrder = [
  NGO_LEVELS.DISTRICT,
  NGO_LEVELS.STATE,
  NGO_LEVELS.NATIONAL,
  NGO_LEVELS.GLOBAL,
];

const NgoCard = ({ ngo, typography, strings }) => (
  <View style={styles.card}>
    <Image source={{ uri: ngo.imageUrl }} style={styles.cardImage} />
    <View style={styles.cardBadge}>
      <Text style={[styles.cardBadgeText, { fontFamily: typography.bold }]}>{ngo.level.toUpperCase()}</Text>
    </View>
    <View style={styles.cardBody}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { fontFamily: typography.bold }]}>{ngo.name}</Text>
          <Text style={[styles.cardCategory, { fontFamily: typography.regular }]}>{ngo.category}</Text>
        </View>
      </View>

      <Text style={[styles.cardDesc, { fontFamily: typography.regular }]} numberOfLines={2}>
        {ngo.description}
      </Text>

      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(ngo.progress * 100, 100)}%` }]} />
        </View>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { fontFamily: typography.semibold }]}>
            ₹{ngo.raisedAmount.toLocaleString()} of ₹{ngo.goalAmount.toLocaleString()}
          </Text>
          <Text style={[styles.progressPercent, { fontFamily: typography.bold }]}>
            {Math.round(ngo.progress * 100)}%
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
        <Text style={[styles.actionBtnText, { fontFamily: typography.bold }]}>View details</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const NgoScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const navigation = useNavigation();
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      // Reset filters when screen comes into focus
      setSelectedLevel('All');
      setSearchQuery('');
    }, [])
  );

  const filteredNgos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ngos.filter((ngo) => {
      const matchesLevel = selectedLevel === 'All' || ngo.level === selectedLevel;
      if (!q) return matchesLevel;
      const haystack = `${ngo.name} ${ngo.category} ${ngo.description}`.toLowerCase();
      return matchesLevel && haystack.includes(q);
    });
  }, [selectedLevel, searchQuery]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>NGO Partners</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>Collaborate for impact</Text>
          </View>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => navigation.navigate('Profile', { screen: 'ProfileContribDetail', params: { mode: 'made' } })}
          >
            <Feather name="clock" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <SearchFilterBar
          searchValue={searchQuery}
          onChangeSearch={setSearchQuery}
          searchPlaceholder="Search NGOs..."
          filters={['All', ...levelOrder.map((level) => ({
            key: level,
            label: level.charAt(0).toUpperCase() + level.slice(1),
          }))]}
          selectedFilter={selectedLevel}
          onSelectFilter={setSelectedLevel}
        />

        {/* List */}
        <FlatList
          data={filteredNgos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NgoCard ngo={item} typography={typography} strings={strings} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="heart-broken-outline" size={64} color={Colors.textSecondary} />
              <Text style={[styles.emptyText, { fontFamily: typography.semibold }]}>No NGO partners in this level</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: 30,
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
  historyBtn: {
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
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
    paddingTop: Spacing.sm,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardBadgeText: {
    color: '#fff',
    fontSize: 10,
    letterSpacing: 1,
  },
  cardBody: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  cardCategory: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressPercent: {
    fontSize: 12,
    color: Colors.success,
  },
  actionBtn: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  actionBtnText: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

