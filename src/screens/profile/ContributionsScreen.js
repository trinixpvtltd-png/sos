import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';

const contributions = [
  {
    id: 'mission-31',
    title: 'Rapid Response - Eastern Corridor',
    detail: 'Led a 9 member taskforce to evacuate 31 survivors within 72 minutes.',
  },
  {
    id: 'mission-26',
    title: 'Rural Helpline Synchronisation',
    detail: 'Integrated 42 helpline nodes into unified SOS router grid.',
  },
];

export const ContributionsScreen = () => {
  const typography = useTypography();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: typography.bold }]}>Field Contributions</Text>
      {contributions.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{item.title}</Text>
          <Text style={[styles.cardDetail, { fontFamily: typography.regular }]}>{item.detail}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
  card: {
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardDetail: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
});
