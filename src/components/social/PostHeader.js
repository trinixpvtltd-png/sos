import React, { useMemo } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';

const getTimeAgo = (timestamp, strings) => {
  if (!timestamp) return strings.social.feed.justNow;

  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMins < 1) return strings.social.feed.justNow;
  if (diffMins < 60) return strings.social.feed.minutesAgo.replace('{count}', String(diffMins));

  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return strings.social.feed.hoursAgo.replace('{count}', String(diffHrs));

  const diffDays = Math.floor(diffHrs / 24);
  return strings.social.feed.daysAgo.replace('{count}', String(diffDays));
};

const getInitials = (name = '') => {
  const parts = String(name).trim().split(' ').filter(Boolean);
  if (!parts.length) return 'SM';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const PostHeader = ({ post, isSaved, onToggleSave, onMore }) => {
  const typography = useTypography();
  const strings = useStrings();
  const timeLabel = useMemo(() => getTimeAgo(post.timestamp, strings), [post.timestamp, strings]);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>{
        <Text style={[styles.avatarText, { fontFamily: typography.bold }]}>{getInitials(post.author)}</Text>
      }</View>

      <View style={styles.metaWrap}>
        <View style={styles.nameRow}>
          <Text style={[styles.author, { fontFamily: typography.semibold }]} numberOfLines={1}>{post.author}</Text>
          {post.isVerified ? (
            <View style={styles.verifiedBadge}>
              <Feather name="check-circle" size={12} color={Colors.info} />
              <Text style={[styles.verifiedText, { fontFamily: typography.semibold }]}>
                {strings.social.feed.verifiedLabel}
              </Text>
            </View>
          ) : null}
          {post.isUrgent ? (
            <View style={styles.urgentBadge}>
              <Feather name="alert-triangle" size={11} color="#fff" />
              <Text style={[styles.urgentText, { fontFamily: typography.semibold }]}>
                {strings.social.feed.urgentLabel}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.handle, { fontFamily: typography.regular }]} numberOfLines={1}>
          {post.handle}  •  {timeLabel}  •  {post.location}
        </Text>

        <View style={styles.categoryChip}>
          <Text style={[styles.categoryText, { fontFamily: typography.semibold }]} numberOfLines={1}>
            {post.category}
          </Text>
        </View>
      </View>

      <View style={styles.actionsWrap}>
        <TouchableOpacity
          style={[styles.iconButton, isSaved && styles.iconButtonActive]}
          onPress={onToggleSave}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? strings.social.actions.unsave : strings.social.actions.save}
        >
          <Feather name={isSaved ? 'bookmark' : 'bookmark'} size={16} color={isSaved ? Colors.primary : Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMore}
          accessibilityRole="button"
          accessibilityLabel={strings.social.actions.more}
        >
          <Feather name="more-horizontal" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,59,48,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 13,
  },
  metaWrap: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  author: {
    color: Colors.textPrimary,
    fontSize: 14,
    maxWidth: 150,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,122,255,0.12)',
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    color: Colors.info,
    fontSize: 10,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  urgentText: {
    color: '#fff',
    fontSize: 10,
  },
  handle: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,149,0,0.12)',
  },
  categoryText: {
    color: Colors.secondary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsWrap: {
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    borderColor: 'rgba(255,59,48,0.35)',
    backgroundColor: 'rgba(255,59,48,0.1)',
  },
});
