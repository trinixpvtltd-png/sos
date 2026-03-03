import React from 'react';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';

const ACTIONS = [
  { key: 'photo', icon: 'image' },
  { key: 'video', icon: 'video' },
  { key: 'alert', icon: 'alert-triangle' },
  { key: 'fundraiser', icon: 'heart' },
];

export const SocialComposerCard = ({ onComposePress, onQuickAction }) => {
  const typography = useTypography();
  const strings = useStrings();

  return (
    <BlurView intensity={70} tint="light" style={styles.card}>
      <TouchableOpacity
        style={styles.promptRow}
        onPress={onComposePress}
        accessibilityRole="button"
        accessibilityLabel={strings.social.composer.prompt}
      >
        <View style={styles.avatarCircle}>
          <Text style={[styles.avatarText, { fontFamily: typography.bold }]}>SM</Text>
        </View>
        <View style={styles.promptBox}>
          <Text style={[styles.promptText, { fontFamily: typography.regular }]}>
            {strings.social.composer.prompt}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.actionsRow}>
        {ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.key}
            style={styles.actionButton}
            onPress={() => onQuickAction(action.key)}
            accessibilityRole="button"
            accessibilityLabel={strings.social.composer.actions[action.key]}
          >
            <Feather name={action.icon} size={15} color={Colors.primary} />
            <Text style={[styles.actionLabel, { fontFamily: typography.semibold }]}>
              {strings.social.composer.actions[action.key]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    padding: Spacing.md,
    backgroundColor: Colors.glass,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,59,48,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 14,
  },
  promptBox: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  promptText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  actionLabel: {
    color: Colors.textPrimary,
    fontSize: 11,
  },
});
