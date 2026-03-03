import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

export const EmptyStateCard = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const typography = useTypography();

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Feather name={icon} size={26} color={Colors.textMuted} />
      </View>
      <Text style={[styles.title, { fontFamily: typography.semibold }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { fontFamily: typography.regular }]}>{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} style={styles.button}>
          <Text style={[styles.buttonText, { fontFamily: typography.semibold }]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#ECECEC',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: 10,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F4F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  button: {
    marginTop: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
  },
});
