import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';
import { CommentPreviewList } from './CommentPreviewList';
import { PostActionRow } from './PostActionRow';
import { PostEngagementBar } from './PostEngagementBar';
import { PostHeader } from './PostHeader';

const LONG_TEXT_LIMIT = 170;

export const SocialPostCard = ({
  post,
  isLiked,
  isSupported,
  isSaved,
  isExpanded,
  commentValue,
  onToggleSave,
  onToggleLike,
  onToggleSupport,
  onToggleExpand,
  onOpenImage,
  onShare,
  onDonate,
  onCommentFocus,
  onChangeComment,
  onOpenDetails,
}) => {
  const typography = useTypography();
  const strings = useStrings();

  const shouldTrim = post.body.length > LONG_TEXT_LIMIT;
  const displayBody = useMemo(() => {
    if (!shouldTrim || isExpanded) {
      return post.body;
    }

    return `${post.body.slice(0, LONG_TEXT_LIMIT)}...`;
  }, [post.body, shouldTrim, isExpanded]);

  const progress = Math.min(100, Math.round((Number(post.raised || 0) / Math.max(1, Number(post.goal || 1))) * 100));

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.98} onPress={onOpenDetails}>
      <PostHeader
        post={post}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onMore={onCommentFocus}
      />

      <Text style={[styles.bodyText, { fontFamily: typography.regular }]}>{displayBody}</Text>
      {shouldTrim ? (
        <TouchableOpacity style={styles.expandBtn} onPress={onToggleExpand}>
          <Text style={[styles.expandText, { fontFamily: typography.semibold }]}>
            {isExpanded ? strings.social.feed.seeLess : strings.social.feed.seeMore}
          </Text>
        </TouchableOpacity>
      ) : null}

      {post.imageUrl ? (
        <TouchableOpacity onPress={onOpenImage} style={styles.imageWrap}>
          <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
      ) : null}

      {post.isUrgent ? (
        <LinearGradient colors={Gradients.warning} style={styles.urgentBanner}>
          <Feather name="clock" size={13} color="#fff" />
          <Text style={[styles.urgentBannerText, { fontFamily: typography.semibold }]}>
            {strings.social.feed.urgentCta.replace('{hours}', String(post.needsSupportInHours || 12))}
          </Text>
        </LinearGradient>
      ) : null}

      {post.goal ? (
        <View style={styles.campaignWrap}>
          <View style={styles.campaignRow}>
            <Text style={[styles.campaignValue, { fontFamily: typography.semibold }]}>
              Rs {Number(post.raised || 0).toLocaleString()}
            </Text>
            <Text style={[styles.campaignGoal, { fontFamily: typography.regular }]}>
              / Rs {Number(post.goal || 0).toLocaleString()}
            </Text>
            <Text style={[styles.progressText, { fontFamily: typography.semibold }]}>{progress}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={[styles.campaignMeta, { fontFamily: typography.regular }]}>
            {strings.social.feed.donorsLabel.replace('{count}', String(post.donorCount || 0))}
          </Text>
        </View>
      ) : null}

      <PostEngagementBar post={post} isLiked={isLiked} isSupported={isSupported} />

      <PostActionRow
        isLiked={isLiked}
        isSupported={isSupported}
        onLike={onToggleLike}
        onComment={onCommentFocus}
        onShare={onShare}
        onDonate={onDonate}
      />

      <CommentPreviewList
        comments={post.commentsPreview || []}
        commentValue={commentValue}
        onChangeComment={onChangeComment}
        onFocus={onCommentFocus}
      />

      <TouchableOpacity style={styles.detailBtn} onPress={onOpenDetails}>
        <Text style={[styles.detailText, { fontFamily: typography.semibold }]}>
          {strings.social.detail.openCase}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    padding: Spacing.md,
    gap: 10,
  },
  bodyText: {
    color: Colors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },
  expandBtn: {
    alignSelf: 'flex-start',
    marginTop: -4,
  },
  expandText: {
    color: Colors.info,
    fontSize: 12,
  },
  imageWrap: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  image: {
    width: '100%',
    height: 230,
  },
  urgentBanner: {
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  urgentBannerText: {
    color: '#fff',
    fontSize: 11,
  },
  campaignWrap: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.86)',
    padding: 10,
    gap: 7,
  },
  campaignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  campaignValue: {
    color: Colors.textPrimary,
    fontSize: 13,
  },
  campaignGoal: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  progressText: {
    marginLeft: 'auto',
    color: Colors.primary,
    fontSize: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  campaignMeta: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  detailBtn: {
    alignSelf: 'flex-start',
    marginTop: -2,
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.3)',
    backgroundColor: 'rgba(255,59,48,0.10)',
  },
  detailText: {
    color: Colors.primary,
    fontSize: 11,
  },
});
