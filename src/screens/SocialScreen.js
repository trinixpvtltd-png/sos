import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { BlurView } from 'expo-blur';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { SOCIAL_CATEGORIES, socialPosts } from '../data/socialPosts';
import { SearchFilterBar } from '../components/SearchFilterBar';

const SocialCard = ({ post, typography, strings }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.authorInfo}>
        <View style={styles.authorAvatar}>
          <Text style={[styles.avatarText, { fontFamily: typography.bold }]}>{post.author[0]}</Text>
        </View>
        <View>
          <Text style={[styles.cardAuthor, { fontFamily: typography.bold }]}>{post.author}</Text>
          <Text style={[styles.cardLocation, { fontFamily: typography.regular }]}>
            <Feather name="map-pin" size={10} color={Colors.textSecondary} /> {post.location}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreBtn}>
        <Feather name="more-horizontal" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>

    <Image source={{ uri: post.imageUrl }} style={styles.cardImage} />

    <View style={styles.cardContent}>
      <Text style={[styles.cardBodyText, { fontFamily: typography.regular }]}>{post.body}</Text>

      <View style={styles.donationSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { fontFamily: typography.semibold }]}>Goal Progress</Text>
          <Text style={[styles.progressPercent, { fontFamily: typography.bold }]}>{Math.round(post.progress * 100)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(post.progress * 100, 100)}%` }]} />
        </View>
        <View style={styles.progressFooter}>
          <Text style={[styles.raisedText, { fontFamily: typography.semibold }]}>
            ₹{post.raised.toLocaleString('en-IN')} Raised
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.donateBtn} activeOpacity={0.8}>
        <Text style={[styles.donateBtnText, { fontFamily: typography.bold }]}>Support Cause</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const SocialScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const [selectedCategory, setSelectedCategory] = useState(SOCIAL_CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      // Reset filters when screen comes into focus
      setSelectedCategory('All');
      setSearchQuery('');
    }, [])
  );

  const posts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return socialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory && selectedCategory !== 'All' ? post.category === selectedCategory : true;
      if (!q) return matchesCategory;
      const haystack = `${post.author} ${post.location} ${post.body}`.toLowerCase();
      return matchesCategory && haystack.includes(q);
    });
  }, [selectedCategory, searchQuery]);

  const categoriesWithAll = ['All', ...SOCIAL_CATEGORIES.filter(c => c !== 'All')];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>Social Feed</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>Support local initiatives</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Feather name="bell" size={22} color={Colors.textPrimary} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <SearchFilterBar
          searchValue={searchQuery}
          onChangeSearch={setSearchQuery}
          searchPlaceholder="Search posts..."
          filters={categoriesWithAll.map((c) => ({ key: c, label: c }))}
          selectedFilter={selectedCategory}
          onSelectFilter={setSelectedCategory}
        />

        {/* Feed */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <SocialCard post={item} typography={typography} strings={strings} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="post-outline" size={64} color={Colors.textSecondary} />
              <Text style={[styles.emptyText, { fontFamily: typography.semibold }]}>No stories found</Text>
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
  notificationBtn: {
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
  notifDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: '#fff',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 18,
  },
  cardAuthor: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  cardLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardBodyText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 20,
  },
  donationSection: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressPercent: {
    fontSize: 12,
    color: Colors.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressFooter: {
    alignItems: 'flex-start',
  },
  raisedText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  donateBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  donateBtnText: {
    color: '#fff',
    fontSize: 16,
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

