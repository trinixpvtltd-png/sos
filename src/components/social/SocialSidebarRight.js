import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';

export const SocialSidebarRight = ({ posts = [] }) => {
  const typography = useTypography();
  const strings = useStrings();

  const urgentPosts = posts.filter((post) => post.isUrgent).slice(0, 3);
  const nearbyPosts = posts.filter((post) => post.isNearby).slice(0, 3);
  const topContributors = [...posts]
    .sort((a, b) => (b.donorCount || 0) - (a.donorCount || 0))
    .slice(0, 3);

  return (
    <View style={styles.container}>
      <WidgetCard title={strings.social.sidebars.widgets.urgentCampaigns} icon="alert-octagon">
        {urgentPosts.length ? urgentPosts.map((post) => (
          <WidgetRow key={post.id} title={post.author} subtitle={post.category} />
        )) : <EmptyHint label={strings.social.sidebars.empty} />}
      </WidgetCard>

      <WidgetCard title={strings.social.sidebars.widgets.nearbyResources} icon="map-pin">
        {nearbyPosts.length ? nearbyPosts.map((post) => (
          <WidgetRow key={`near-${post.id}`} title={post.location} subtitle={post.author} />
        )) : <EmptyHint label={strings.social.sidebars.empty} />}
      </WidgetCard>

      <WidgetCard title={strings.social.sidebars.widgets.topContributors} icon="award">
        {topContributors.length ? topContributors.map((post) => (
          <WidgetRow
            key={`top-${post.id}`}
            title={post.author}
            subtitle={strings.social.feed.donorsLabel.replace('{count}', String(post.donorCount || 0))}
          />
        )) : <EmptyHint label={strings.social.sidebars.empty} />}
      </WidgetCard>

      <WidgetCard title={strings.social.sidebars.widgets.trendingTags} icon="hash">
        {(strings.social.sidebars.tags || []).map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </WidgetCard>

      <WidgetCard title={strings.social.sidebars.widgets.safetyTips} icon="shield">
        <Text style={[styles.tipText, { fontFamily: typography.regular }]}>1. {strings.social.sidebars.tips.tipOne}</Text>
        <Text style={[styles.tipText, { fontFamily: typography.regular }]}>2. {strings.social.sidebars.tips.tipTwo}</Text>
        <Text style={[styles.tipText, { fontFamily: typography.regular }]}>3. {strings.social.sidebars.tips.tipThree}</Text>
      </WidgetCard>
    </View>
  );
};

const WidgetCard = ({ title, icon, children }) => {
  const typography = useTypography();

  return (
    <View style={styles.widgetCard}>
      <View style={styles.widgetTitleRow}>
        <Feather name={icon} size={14} color={Colors.primary} />
        <Text style={[styles.widgetTitle, { fontFamily: typography.semibold }]}>{title}</Text>
      </View>
      <View style={styles.widgetBody}>{children}</View>
    </View>
  );
};

const WidgetRow = ({ title, subtitle }) => {
  const typography = useTypography();

  return (
    <View style={styles.widgetRow}>
      <Text style={[styles.widgetRowTitle, { fontFamily: typography.semibold }]} numberOfLines={1}>{title}</Text>
      <Text style={[styles.widgetRowSubtitle, { fontFamily: typography.regular }]} numberOfLines={1}>{subtitle}</Text>
    </View>
  );
};

const TagPill = ({ label }) => {
  const typography = useTypography();
  return (
    <View style={styles.tagPill}>
      <Text style={[styles.tagText, { fontFamily: typography.semibold }]}>{label}</Text>
    </View>
  );
};

const EmptyHint = ({ label }) => {
  const typography = useTypography();
  return <Text style={[styles.emptyHint, { fontFamily: typography.regular }]}>{label}</Text>;
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  widgetCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    padding: 12,
    gap: 8,
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  widgetTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
  },
  widgetBody: {
    gap: 8,
  },
  widgetRow: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(255,255,255,0.70)',
    paddingHorizontal: 9,
    paddingVertical: 7,
    gap: 2,
  },
  widgetRowTitle: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  widgetRowSubtitle: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  tagPill: {
    alignSelf: 'flex-start',
    borderRadius: Radius.md,
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,122,255,0.12)',
  },
  tagText: {
    color: Colors.info,
    fontSize: 11,
  },
  tipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  emptyHint: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});
