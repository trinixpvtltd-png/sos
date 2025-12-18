import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.successBox}>
            <View style={styles.iconCircle}>
              <Feather name="check" size={42} color="#fff" />
            </View>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>Report Sent Successfully</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>
              Our team has received your report and is initiating response protocols.
            </Text>
          </View>

          <View style={styles.detailsCard}>
            <Text style={[styles.detailTitle, { fontFamily: typography.semibold }]}>What happens next?</Text>
            <View style={styles.stepItem}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
              <Text style={[styles.stepText, { fontFamily: typography.regular }]}>Emergency dispatcher reviews the details.</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
              <Text style={[styles.stepText, { fontFamily: typography.regular }]}>Nearby response units are notified.</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
              <Text style={[styles.stepText, { fontFamily: typography.regular }]}>You will receive updates directly in your activity log.</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.primaryBtn} onPress={goHome}>
              <Text style={[styles.primaryBtnText, { fontFamily: typography.bold }]}>Return Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('DistressSignal')}
            >
              <Text style={[styles.secondaryBtnText, { fontFamily: typography.semibold }]}>View Activity Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  successBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.success,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    fontSize: 24,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  detailTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    marginTop: 40,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: Colors.textPrimary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  secondaryBtn: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
});

