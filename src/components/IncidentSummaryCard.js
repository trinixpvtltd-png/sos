import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { StatusChip } from './StatusChip';

export const IncidentSummaryCard = ({
  incident,
  onPress,
  subtitle,
}) => {
  const typography = useTypography();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.headerRow}>
        <Text style={[styles.id, { fontFamily: typography.semibold }]} numberOfLines={1}>
          {incident.id}
        </Text>
        <StatusChip status={incident.status} label={incident.status} />
      </View>

      <Text style={[styles.type, { fontFamily: typography.bold }]}>
        {incident.type}
      </Text>
      <Text style={[styles.description, { fontFamily: typography.regular }]} numberOfLines={2}>
        {incident.description}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.metaItem}>
          <Feather name="map-pin" size={12} color={Colors.textMuted} />
          <Text style={[styles.metaText, { fontFamily: typography.regular }]} numberOfLines={1}>
            {incident.location?.text}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color={Colors.textMuted} />
          <Text style={[styles.metaText, { fontFamily: typography.regular }]}>
            {new Date(incident.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>

      {subtitle ? <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{subtitle}</Text> : null}
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
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  id: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMuted,
  },
  type: {
    fontSize: 17,
    color: Colors.textPrimary,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footerRow: {
    gap: 6,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 12,
  },
  subtitle: {
    marginTop: 2,
    color: Colors.info,
    fontSize: 12,
  },
});
