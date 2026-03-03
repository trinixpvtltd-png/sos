import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { socialPosts } from '../data/socialPosts';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';

export const SocialPostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const strings = useStrings();
  const typography = useTypography();

  const post = useMemo(
    () => socialPosts.find((item) => item.id === route.params?.postId),
    [route.params?.postId],
  );

  if (!post) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Feather name="arrow-left" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyTitle, { fontFamily: typography.bold }]}>
              {strings.social.detail.notFoundTitle}
            </Text>
            <Text style={[styles.emptySubtitle, { fontFamily: typography.regular }]}>
              {strings.social.detail.notFoundDescription}
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const progress = Math.min(100, Math.round((Number(post.raised || 0) / Math.max(1, Number(post.goal || 1))) * 100));

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Feather name="arrow-left" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: typography.semibold }]} numberOfLines={1}>
            {strings.social.detail.title}
          </Text>
          <View style={styles.iconBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={[styles.author, { fontFamily: typography.bold }]}>{post.author}</Text>
            <Text style={[styles.meta, { fontFamily: typography.regular }]}>
              {post.handle} • {post.location}
            </Text>
            <View style={styles.tagRow}>
              <Tag label={post.category} />
              {post.isVerified ? <Tag label={strings.social.feed.verifiedLabel} type="verified" /> : null}
              {post.isUrgent ? <Tag label={strings.social.feed.urgentLabel} type="urgent" /> : null}
            </View>
          </View>

          {post.imageUrl ? (
            <Image source={{ uri: post.imageUrl }} style={styles.coverImage} resizeMode="cover" />
          ) : null}

          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>
              {strings.social.detail.descriptionTitle}
            </Text>
            <Text style={[styles.description, { fontFamily: typography.regular }]}>{post.body}</Text>
          </View>

          {post.goal ? (
            <View style={styles.card}>
              <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>
                {strings.social.detail.campaignTitle}
              </Text>
              <View style={styles.fundingRow}>
                <Text style={[styles.fundingValue, { fontFamily: typography.bold }]}>
                  Rs {Number(post.raised || 0).toLocaleString()}
                </Text>
                <Text style={[styles.fundingGoal, { fontFamily: typography.regular }]}>
                  / Rs {Number(post.goal || 0).toLocaleString()}
                </Text>
                <Text style={[styles.progressText, { fontFamily: typography.semibold }]}>{progress}%</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${progress}%` }]} />
              </View>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>
              {strings.social.detail.engagementTitle}
            </Text>
            <Text style={[styles.meta, { fontFamily: typography.regular }]}>
              {post.reactionsCount || 0} {strings.social.actions.like} • {post.commentsCount || 0} {strings.social.actions.comment}
              {' '}• {post.sharesCount || 0} {strings.social.actions.share}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const Tag = ({ label, type = 'default' }) => {
  const typography = useTypography();
  const styleMap = {
    default: styles.tagDefault,
    verified: styles.tagVerified,
    urgent: styles.tagUrgent,
  };
  const textStyleMap = {
    default: styles.tagTextDefault,
    verified: styles.tagTextVerified,
    urgent: styles.tagTextUrgent,
  };

  return (
    <View style={[styles.tag, styleMap[type]]}>
      <Text style={[styles.tagText, { fontFamily: typography.semibold }, textStyleMap[type]]}>{label}</Text>
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 10,
    color: Colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 110,
    gap: 10,
  },
  coverImage: {
    width: '100%',
    height: 220,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 14,
    gap: 8,
  },
  author: {
    color: Colors.textPrimary,
    fontSize: 20,
  },
  meta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagDefault: {
    backgroundColor: 'rgba(255,149,0,0.13)',
  },
  tagVerified: {
    backgroundColor: 'rgba(0,122,255,0.12)',
  },
  tagUrgent: {
    backgroundColor: 'rgba(255,59,48,0.12)',
  },
  tagText: {
    fontSize: 11,
  },
  tagTextDefault: {
    color: Colors.secondary,
    textTransform: 'capitalize',
  },
  tagTextVerified: {
    color: Colors.info,
  },
  tagTextUrgent: {
    color: Colors.primary,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  fundingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fundingValue: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  fundingGoal: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  progressText: {
    marginLeft: 'auto',
    color: Colors.primary,
    fontSize: 12,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});

