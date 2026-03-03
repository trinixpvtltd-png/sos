import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';

export const SocialSidebarLeft = ({ activeTab, onSelectTab, savedCount }) => {
  const typography = useTypography();
  const strings = useStrings();

  const links = [
    { key: 'all', icon: 'home', label: strings.social.sidebars.links.allFeed },
    { key: 'saved', icon: 'bookmark', label: strings.social.sidebars.links.savedPosts, count: savedCount },
    { key: 'verified', icon: 'shield', label: strings.social.sidebars.links.verifiedNgos },
    { key: 'relief', icon: 'alert-circle', label: strings.social.sidebars.links.urgentAppeals },
    { key: 'medical', icon: 'activity', label: strings.social.sidebars.links.medicalHelp },
    { key: 'awareness', icon: 'flag', label: strings.social.sidebars.links.awareness },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: typography.semibold }]}>
        {strings.social.sidebars.leftTitle}
      </Text>
      {links.map((link) => {
        const isActive = activeTab === link.key;

        return (
          <TouchableOpacity
            key={link.key}
            style={[styles.linkRow, isActive && styles.linkRowActive]}
            onPress={() => onSelectTab(link.key)}
          >
            <Feather name={link.icon} size={15} color={isActive ? Colors.primary : Colors.textMuted} />
            <Text
              style={[
                styles.linkText,
                { fontFamily: typography.semibold },
                isActive && styles.linkTextActive,
              ]}
              numberOfLines={1}
            >
              {link.label}
            </Text>
            {typeof link.count === 'number' ? (
              <View style={styles.countBadge}>
                <Text style={[styles.countText, { fontFamily: typography.semibold }]}>{link.count}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 12,
    gap: 8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  linkRowActive: {
    backgroundColor: 'rgba(255,59,48,0.10)',
    borderColor: 'rgba(255,59,48,0.35)',
  },
  linkText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  linkTextActive: {
    color: Colors.primary,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countText: {
    color: '#fff',
    fontSize: 10,
  },
});
