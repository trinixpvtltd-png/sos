import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useStrings } from '../localization/useStrings';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

export const LoginScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const { setIsAuthenticated } = useAppContext();
  const { width } = useWindowDimensions();

  const contentStyle = [
    styles.content,
    width >= 768 && { maxWidth: 480 },
  ];

  return (
    <View style={styles.container}>
      <View style={contentStyle}>
        <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.loginTitle}</Text>
        <TouchableOpacity style={styles.button} onPress={() => setIsAuthenticated(true)}>
          <Text style={[styles.buttonLabel, { fontFamily: typography.semibold }]}>
            {strings.loginCta}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
