import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';

const ACTIONS = [
  { key: 'like', icon: 'thumbs-up' },
  { key: 'comment', icon: 'message-circle' },
  { key: 'share', icon: 'share-2' },
  { key: 'donate', icon: 'heart' },
];

export const PostActionRow = ({
  isLiked,
  isSupported,
  onLike,
  onComment,
  onShare,
  onDonate,
}) => {
  const typography = useTypography();
  const strings = useStrings();

  const actionMap = {
    like: {
      label: isLiked ? strings.social.actions.liked : strings.social.actions.like,
      active: isLiked,
      onPress: onLike,
    },
    comment: {
      label: strings.social.actions.comment,
      active: false,
      onPress: onComment,
    },
    share: {
      label: strings.social.actions.share,
      active: false,
      onPress: onShare,
    },
    donate: {
      label: isSupported ? strings.social.actions.supported : strings.social.actions.donate,
      active: isSupported,
      onPress: onDonate,
    },
  };

  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => {
        const item = actionMap[action.key];

        return (
          <TouchableOpacity
            key={action.key}
            style={[styles.actionButton, item.active && styles.actionButtonActive]}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <Feather name={action.icon} size={14} color={item.active ? Colors.primary : Colors.textMuted} />
            <Text
              style={[
                styles.actionText,
                { fontFamily: typography.semibold },
                item.active && styles.actionTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 4,
  },
  actionButton: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.72)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonActive: {
    borderColor: 'rgba(255,59,48,0.35)',
    backgroundColor: 'rgba(255,59,48,0.10)',
  },
  actionText: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  actionTextActive: {
    color: Colors.primary,
  },
});
