import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { StatusChip } from './StatusChip';

export const TimelineItem = ({ item, isLast }) => {
  const typography = useTypography();
  const isDone = item.status !== 'active';

  return (
    <View style={styles.itemRow}>
      <View style={styles.axisWrap}>
        <View style={[styles.dot, isDone ? styles.dotDone : styles.dotActive]}>
          <Feather name={isDone ? 'check' : 'clock'} size={10} color="#fff" />
        </View>
        {!isLast && <View style={styles.axisLine} />}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { fontFamily: typography.semibold }]}>{item.title}</Text>
          <StatusChip status={item.status} label={item.status || 'done'} />
        </View>
        <Text style={[styles.desc, { fontFamily: typography.regular }]}>{item.description}</Text>
        <Text style={[styles.meta, { fontFamily: typography.regular }]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

export const TimelineList = ({ items = [] }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      {items.map((item, index) => (
        <TimelineItem key={item.id || `${item.title}-${index}`} item={item} isLast={index === items.length - 1} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#ECECEC',
    gap: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  axisWrap: {
    alignItems: 'center',
    width: 22,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: Colors.success,
  },
  dotActive: {
    backgroundColor: Colors.warning,
  },
  axisLine: {
    marginTop: 4,
    width: 2,
    flex: 1,
    backgroundColor: '#E3E3E3',
  },
  content: {
    flex: 1,
    gap: 6,
    paddingBottom: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  desc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
