import { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { LanguageToggleChip } from '../components/LanguageToggleChip';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { SOCIAL_CATEGORIES, socialPosts } from '../data/socialPosts';

export const SocialScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const [selectedCategory, setSelectedCategory] = useState(SOCIAL_CATEGORIES[0]);

  const posts = useMemo(() => {
    return socialPosts.filter((post) =>
      selectedCategory ? post.category === selectedCategory : true,
    );
  }, [selectedCategory]);

  return (
    <LinearGradient colors={['#E5D3C0', '#D0BA9F', '#C5AB8D']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topRow}>
          <View style={styles.menuIcon}>
            <Text style={[styles.menuText, { fontFamily: typography.semibold }]}>≡</Text>
          </View>
          <LanguageToggleChip />
        </View>
        <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.social?.title}</Text>
        <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.social?.filterLabel}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
          contentContainerStyle={{ gap: Spacing.sm }}
        >
          {SOCIAL_CATEGORIES.map((category) => {
            const active = category === selectedCategory;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.9}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    { fontFamily: typography.semibold },
                    active && styles.chipLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
          renderItem={({ item }) => (
            <SocialCard post={item} typography={typography} strings={strings} />
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyCard}>
              <Text style={[styles.emptyText, { fontFamily: typography.semibold }]}>
                No posts available
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.lg }} />}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const SocialCard = ({ post, typography, strings }) => (
  <View style={styles.card}>
    <Image source={{ uri: post.imageUrl }} style={styles.cardImage} />
    <View style={styles.cardBody}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardAuthor, { fontFamily: typography.bold }]}>
            {post.author} <Text style={styles.cardHandle}>{post.handle}</Text>
          </Text>
          <Text style={[styles.cardLocation, { fontFamily: typography.regular }]}>{post.location}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={[styles.shareLabel, { fontFamily: typography.semibold }]}>↗</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.cardBodyText, { fontFamily: typography.regular }]}>{post.body}</Text>
      <Text style={[styles.timestamp, { fontFamily: typography.regular }]}>
        {new Date(post.timestamp).toLocaleString()}
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.min(post.progress * 100, 100)}%` }]} />
      </View>
      <View style={styles.cardFooter}>
        <Text style={[styles.progressCopy, { fontFamily: typography.semibold }]}>
          ₹{post.raised.toLocaleString('en-IN', { maximumFractionDigits: 0 })}{' '}
          {strings.social?.progressLabel}
        </Text>
        <TouchableOpacity style={styles.donateButton} activeOpacity={0.9}>
          <Text style={[styles.donateLabel, { fontFamily: typography.semibold }]}>
            {strings.social?.donate}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 28,
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: Spacing.xs,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  chipRow: {
    marginVertical: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  chipLabelActive: {
    color: '#fff',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    minHeight: 320,
  },
  cardImage: {
    width: '100%',
    height: 210,
  },
  cardBody: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  cardAuthor: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  cardHandle: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  cardLocation: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  cardBodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  progressTrack: {
    height: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceElevated,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCopy: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  donateButton: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary,
  },
  donateLabel: {
    color: '#fff',
    fontSize: 14,
  },
});
