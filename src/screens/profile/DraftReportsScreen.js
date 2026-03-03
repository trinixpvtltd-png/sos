import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';
import { useDraftReportsContext } from '../../context/DraftReportsContext';
import { EmptyStateCard } from '../../components/EmptyStateCard';
import { LoadingSkeletonCard } from '../../components/LoadingSkeletonCard';
import { StatusChip } from '../../components/StatusChip';

export const DraftReportsScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { draftReports, isLoading, deleteDraft } = useDraftReportsContext();

  const onDelete = (draftId) => {
    Alert.alert(strings.drafts.deleteTitle, strings.drafts.deleteMessage, [
      { text: strings.common.cancel, style: 'cancel' },
      {
        text: strings.common.delete,
        style: 'destructive',
        onPress: () => deleteDraft(draftId),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.drafts.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.drafts.subtitle}</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <LoadingSkeletonCard lines={3} />
            <LoadingSkeletonCard lines={2} />
          </View>
        ) : (
          <FlatList
            data={draftReports}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]} numberOfLines={1}>
                      {item.title || strings.drafts.untitled}
                    </Text>
                    <Text style={[styles.meta, { fontFamily: typography.regular }]}>
                      {new Date(item.updatedAt).toLocaleString()}
                    </Text>
                  </View>
                  <StatusChip status={item.status} label={item.status} />
                </View>

                <Text style={[styles.description, { fontFamily: typography.regular }]} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('Revelation', { draftId: item.id })}
                  >
                    <Feather name="edit-2" size={14} color={Colors.textPrimary} />
                    <Text style={[styles.actionText, { fontFamily: typography.semibold }]}>{strings.drafts.resume}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(item.id)}>
                    <Feather name="trash-2" size={14} color={Colors.primary} />
                    <Text style={[styles.actionText, { fontFamily: typography.semibold, color: Colors.primary }]}>
                      {strings.common.delete}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={(
              <EmptyStateCard
                icon="file-text"
                title={strings.drafts.emptyTitle}
                description={strings.drafts.emptyDescription}
                actionLabel={strings.drafts.createDraft}
                onAction={() => navigation.navigate('Revelation')}
              />
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, color: Colors.textPrimary },
  subtitle: { color: Colors.textMuted, fontSize: 13 },
  loadingWrap: {
    paddingHorizontal: Spacing.lg,
    gap: 10,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  meta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.md,
    backgroundColor: '#F6F6F8',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  actionText: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
});
