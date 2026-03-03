import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';

export const ReadinessProgressCard = ({
  progress,
  checklist,
  onPress,
  actionLabel,
  title,
}) => {
  const typography = useTypography();
  const strings = useStrings();

  return (
    <TouchableOpacity activeOpacity={onPress ? 0.85 : 1} onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { fontFamily: typography.semibold }]}>
          {title || strings.safetySetup.readinessTitle}
        </Text>
        <Text style={[styles.percent, { fontFamily: typography.bold }]}>{progress.percent}%</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress.percent}%` }]} />
      </View>

      <Text style={[styles.caption, { fontFamily: typography.regular }]}>
        {progress.completedCount}/{progress.totalCount} {strings.common.completed}
      </Text>

      <View style={styles.checklist}>
        {checklist.map((item) => (
          <View style={styles.itemRow} key={item.key}>
            <Feather
              name={item.complete ? 'check-circle' : 'circle'}
              size={14}
              color={item.complete ? Colors.success : Colors.textMuted}
            />
            <Text style={[styles.itemText, { fontFamily: typography.regular }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      {actionLabel ? (
        <View style={styles.footerRow}>
          <Text style={[styles.actionLabel, { fontFamily: typography.semibold }]}>{actionLabel}</Text>
          <Feather name="chevron-right" size={16} color={Colors.primary} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: Spacing.md,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  percent: {
    fontSize: 18,
    color: Colors.primary,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E8E8EA',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
  },
  caption: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  checklist: {
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  footerRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  actionLabel: {
    color: Colors.primary,
    fontSize: 13,
  },
});
