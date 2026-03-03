import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius } from '../theme/metrics';
import { useTypography } from '../theme/typography';

const STATUS_CONFIG = {
  success: { color: Colors.success, icon: 'check-circle' },
  pending: { color: Colors.warning, icon: 'clock' },
  failed: { color: Colors.primary, icon: 'alert-circle' },
  active: { color: Colors.info, icon: 'radio' },
  resolved: { color: Colors.success, icon: 'shield' },
  sending: { color: Colors.warning, icon: 'send' },
  default: { color: Colors.textMuted, icon: 'info' },
};

const normalizeStatus = (status) => {
  const value = String(status || '').toLowerCase();

  if (value.includes('success')) return 'success';
  if (value.includes('pending') || value.includes('waiting')) return 'pending';
  if (value.includes('fail')) return 'failed';
  if (value.includes('active') || value.includes('sent') || value.includes('scene')) return 'active';
  if (value.includes('resolved') || value.includes('safe') || value.includes('closed')) return 'resolved';
  if (value.includes('sending') || value.includes('new')) return 'sending';
  return 'default';
};

export const StatusChip = ({ status, label }) => {
  const typography = useTypography();
  const key = normalizeStatus(status || label);
  const config = STATUS_CONFIG[key] || STATUS_CONFIG.default;

  return (
    <View style={[styles.container, { backgroundColor: `${config.color}1A`, borderColor: `${config.color}33` }]}>
      <Feather name={config.icon} size={12} color={config.color} />
      <Text style={[styles.label, { fontFamily: typography.semibold, color: config.color }]}>
        {label || status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
