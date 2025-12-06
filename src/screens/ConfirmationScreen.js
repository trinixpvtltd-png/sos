import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStrings } from '../localization/useStrings';
import { Colors, Gradients } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

export const ConfirmationScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const navigation = useNavigation();

  const goHome = () => {
    navigation.navigate('Tabs', { screen: 'Home' });
  };

  return (
    <LinearGradient colors={Gradients.warmVertical} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Feather name="check" size={36} color="#fff" />
          </View>
          <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.confirmationTitle}</Text>
          <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.confirmationSubtitle}</Text>
          <Text style={[styles.details, { fontFamily: typography.regular }]}>{strings.confirmationDetails}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={goHome}>
              <Text style={[styles.primaryLabel, { fontFamily: typography.semibold }]}>
                {strings.confirmationPrimary}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={[styles.secondaryLabel, { fontFamily: typography.semibold }]}>
                {strings.confirmationSecondary}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: Spacing.lg,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 26,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: Spacing.sm,
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  details: {
    marginTop: Spacing.md,
    textAlign: 'center',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  buttonRow: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#fff',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textMuted,
  },
  secondaryLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
});
