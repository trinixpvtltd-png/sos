import React from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';

export const CommentPreviewList = ({
  comments,
  commentValue,
  onChangeComment,
  onFocus,
}) => {
  const typography = useTypography();
  const strings = useStrings();

  return (
    <View style={styles.container}>
      {comments.slice(0, 2).map((comment) => (
        <View key={comment.id} style={styles.commentRow}>
          <Text style={[styles.commentAuthor, { fontFamily: typography.semibold }]}>{comment.author}</Text>
          <Text style={[styles.commentText, { fontFamily: typography.regular }]}>{comment.text}</Text>
          <Text style={[styles.commentMeta, { fontFamily: typography.regular }]}>{comment.timeAgo}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.viewAllBtn} onPress={onFocus}>
        <Text style={[styles.viewAllText, { fontFamily: typography.semibold }]}>
          {strings.social.feed.viewAllComments}
        </Text>
      </TouchableOpacity>

      <View style={styles.inputRow}>
        <Feather name="message-circle" size={14} color={Colors.textMuted} />
        <TextInput
          value={commentValue}
          onChangeText={onChangeComment}
          onFocus={onFocus}
          style={[styles.input, { fontFamily: typography.regular }]}
          placeholder={strings.social.feed.commentPlaceholder}
          placeholderTextColor={Colors.textMuted}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={onFocus}>
          <Feather name="send" size={13} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  commentRow: {
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  commentAuthor: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  commentText: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  commentMeta: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  viewAllBtn: {
    alignSelf: 'flex-start',
  },
  viewAllText: {
    color: Colors.info,
    fontSize: 11,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.82)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    paddingVertical: 4,
    outlineStyle: 'none',
  },
  sendBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,59,48,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
