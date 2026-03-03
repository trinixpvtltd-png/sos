import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';

export const SocialFilterChips = ({ tabs, activeTab, onSelect }) => {
  const typography = useTypography();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(tab.key)}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
          >
            <Text
              style={[
                styles.chipText,
                { fontFamily: typography.semibold },
                isActive && styles.chipTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  chip: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  chipTextActive: {
    color: '#fff',
  },
});
