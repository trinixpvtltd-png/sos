import React from 'react';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Gradients } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';

const HIGHLIGHT_ICONS = {
  nearbyAlerts: 'map-pin',
  urgentCampaigns: 'alert-octagon',
  verifiedNgos: 'shield',
  medicalRequests: 'activity',
  shelterUpdates: 'home',
  awarenessDrive: 'flag',
};

export const SocialHighlightsRow = ({ onSelect }) => {
  const typography = useTypography();
  const strings = useStrings();

  const items = strings.social.highlights.items;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>
        {strings.social.highlights.title}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => onSelect(item.key)}
            style={styles.cardTouch}
            accessibilityRole="button"
            accessibilityLabel={item.title}
          >
            <LinearGradient
              colors={item.key === 'urgentCampaigns' ? Gradients.warning : Gradients.primary}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconCircle}>
                <Feather name={HIGHLIGHT_ICONS[item.key] || 'star'} size={15} color="#fff" />
              </View>
              <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.cardCount, { fontFamily: typography.regular }]} numberOfLines={1}>
                {item.countLabel}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  scrollContent: {
    gap: 10,
    paddingVertical: 2,
  },
  cardTouch: {
    width: 148,
  },
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    gap: 8,
    minHeight: 94,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 13,
  },
  cardCount: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 11,
  },
});
