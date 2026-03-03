import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { StatusChip } from './StatusChip';

export const ContactCard = ({
  contact,
  onPress,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const typography = useTypography();
  const strings = useStrings();

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { fontFamily: typography.semibold }]}>{contact.name}</Text>
          <Text style={[styles.phone, { fontFamily: typography.regular }]}>{contact.phone}</Text>
        </View>
        <Switch
          value={contact.isActiveForSos}
          onValueChange={() => onToggle?.(contact.id)}
          trackColor={{ true: `${Colors.success}77`, false: '#D0D0D0' }}
          thumbColor={contact.isActiveForSos ? Colors.success : '#F5F5F5'}
        />
      </View>

      <View style={styles.metaRow}>
        <StatusChip label={contact.relation} status={contact.relation} />
        <StatusChip label={contact.priority} status={contact.priority} />
        <StatusChip
          label={contact.isActiveForSos ? strings.common.active : strings.common.inactive}
          status={contact.isActiveForSos ? 'active' : 'failed'}
        />
      </View>

      {contact.notes ? (
        <Text style={[styles.notes, { fontFamily: typography.regular }]} numberOfLines={2}>
          {contact.notes}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit?.(contact)}>
          <Feather name="edit-2" size={16} color={Colors.textPrimary} />
          <Text style={[styles.actionText, { fontFamily: typography.semibold }]}>{strings.common.edit}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete?.(contact)}>
          <Feather name="trash-2" size={16} color={Colors.primary} />
          <Text style={[styles.actionText, { fontFamily: typography.semibold, color: Colors.primary }]}>{strings.common.delete}</Text>
        </TouchableOpacity>
      </View>
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
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  phone: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  notes: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    backgroundColor: '#F7F7F8',
  },
  actionText: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
});
