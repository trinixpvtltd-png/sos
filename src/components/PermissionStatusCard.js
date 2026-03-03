import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { StatusChip } from './StatusChip';

export const PermissionStatusCard = ({
  permission,
  onToggle,
  actionLabel,
}) => {
  const typography = useTypography();
  const strings = useStrings();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { fontFamily: typography.semibold }]}>{permission.title}</Text>
          <Text style={[styles.description, { fontFamily: typography.regular }]}> {permission.description}</Text>
        </View>
        <StatusChip
          status={permission.enabled ? 'success' : 'failed'}
          label={permission.enabled ? strings.permissions.enabledLabel : strings.permissions.disabledLabel}
        />
      </View>

      <View style={styles.footerRow}>
        <Text style={[styles.helper, { fontFamily: typography.regular }]}> 
          {permission.required ? strings.permissions.requiredHint : strings.permissions.optionalHint}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onToggle}>
          <Feather
            name={permission.enabled ? 'toggle-right' : 'toggle-left'}
            size={18}
            color="#fff"
          />
          <Text style={[styles.buttonLabel, { fontFamily: typography.semibold }]}> 
            {actionLabel || (permission.enabled ? strings.permissions.disable : strings.permissions.enable)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  helper: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: Colors.textPrimary,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 12,
  },
});
