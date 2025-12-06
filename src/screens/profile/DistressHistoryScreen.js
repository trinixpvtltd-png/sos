import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';

const incidents = [
  {
    id: 'ticket-9021',
    label: 'SOS #9021 - Industrial belt',
    status: 'Closed',
    responseTime: '11 min',
  },
  {
    id: 'ticket-9018',
    label: 'SOS #9018 - Metro corridor',
    status: 'In Review',
    responseTime: 'Pending',
  },
];

export const DistressHistoryScreen = () => {
  const typography = useTypography();

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={incidents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={[styles.label, { fontFamily: typography.semibold }]}>{item.label}</Text>
          <Text style={[styles.status, { fontFamily: typography.regular }]}>{item.status}</Text>
          <Text style={[styles.meta, { fontFamily: typography.regular }]}>Response: {item.responseTime}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    padding: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  status: {
    marginTop: Spacing.xs,
    color: Colors.primary,
  },
  meta: {
    marginTop: Spacing.xs,
    color: Colors.textMuted,
  },
});
