import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';

const ATTACHMENT_ICONS = {
  photo: 'image',
  video: 'video',
  voice: 'mic',
  audio: 'mic',
  file: 'file-text',
};

export const AttachmentPreviewList = ({
  attachments = [],
  onAdd,
}) => {
  const typography = useTypography();
  const strings = useStrings();

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { fontFamily: typography.semibold }]}>{strings.common.attachments}</Text>
        {onAdd ? (
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Feather name="plus" size={14} color={Colors.primary} />
            <Text style={[styles.addLabel, { fontFamily: typography.semibold }]}>{strings.common.add}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {attachments.length === 0 ? (
        <View style={styles.emptyRow}>
          <Feather name="paperclip" size={14} color={Colors.textMuted} />
          <Text style={[styles.emptyText, { fontFamily: typography.regular }]}>{strings.common.noAttachments}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {attachments.map((item) => (
            <View key={item.id} style={styles.item}>
              {item.type === 'photo' && item.uri ? (
                <Image source={{ uri: item.uri }} style={styles.imageThumb} resizeMode="cover" />
              ) : (
                <View style={styles.iconWrap}>
                  <Feather
                    name={ATTACHMENT_ICONS[item.type] || ATTACHMENT_ICONS.file}
                    size={14}
                    color={Colors.textPrimary}
                  />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { fontFamily: typography.semibold }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.itemType, { fontFamily: typography.regular }]}> {item.type}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
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
    color: Colors.textPrimary,
    fontSize: 15,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}12`,
  },
  addLabel: {
    color: Colors.primary,
    fontSize: 12,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F3',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageThumb: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#F4F4F6',
  },
  itemName: {
    color: Colors.textPrimary,
    fontSize: 13,
  },
  itemType: {
    color: Colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
  },
});
