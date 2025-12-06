import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

export const PlaceholderScreen = ({ title, description }) => {
  const typography = useTypography();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: typography.bold }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { fontFamily: typography.regular }]}>{description}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
