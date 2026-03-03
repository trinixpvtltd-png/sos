import React, { useMemo } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';

export const PostEngagementBar = ({ post, isLiked, isSupported }) => {
  const typography = useTypography();
  const strings = useStrings();

  const stats = useMemo(() => ({
    reactions: Number(post.reactionsCount || 0) + (isLiked ? 1 : 0),
    comments: Number(post.commentsCount || 0),
    shares: Number(post.sharesCount || 0),
    donors: Number(post.donorCount || 0) + (isSupported ? 1 : 0),
  }), [post, isLiked, isSupported]);

  return (
    <View style={styles.container}>
      <View style={styles.leftSummary}>
        <View style={styles.reactionIcons}>
          <Feather name="thumbs-up" size={11} color={Colors.info} />
          <Feather name="heart" size={11} color={Colors.primary} />
        </View>
        <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>
          {stats.reactions}
        </Text>
      </View>

      <View style={styles.rightSummary}>
        <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>{stats.comments}</Text>
        <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>
          {strings.social.feed.commentsLabel}
        </Text>
        <Text style={[styles.summaryDot, { fontFamily: typography.regular }]}>|</Text>
        <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>{stats.shares}</Text>
        <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>
          {strings.social.feed.sharesLabel}
        </Text>
        <Text style={[styles.summaryDot, { fontFamily: typography.regular }]}>|</Text>
        <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>{stats.donors}</Text>
        <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>
          {strings.social.feed.supportersLabel}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  leftSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  summaryText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  summaryDot: {
    color: Colors.textMuted,
    fontSize: 12,
    marginHorizontal: 1,
  },
});
