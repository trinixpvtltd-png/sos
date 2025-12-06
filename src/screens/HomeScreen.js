import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Gradients, Colors } from '../theme/colors';
import { Spacing } from '../theme/metrics';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';

export const HomeScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const navigation = useNavigation();

  const handleSosPress = () =>
    navigation.navigate('DistressSignal', { initialTab: 'sos' });

  const handleMediaPress = () =>
    navigation.navigate('DistressSignal', { initialTab: 'media' });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={Gradients.warmVertical} style={styles.container}>
        <View style={styles.topRow}>
          <Text style={[styles.muted, { fontFamily: typography.semibold }]}>Home</Text>
          <TouchableOpacity
            style={styles.profile}
            onPress={() => navigation.navigate('Profile')}
          >
            <Feather name="user" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerWrapper}>
          <TouchableOpacity activeOpacity={0.9} onPress={handleSosPress}>
            <View style={styles.sosCircle}>
              <Text style={[styles.sosText, { fontFamily: typography.bold }]}>
                {strings.sosButton}
              </Text>
              <Text style={[styles.sosSub, { fontFamily: typography.regular }]}>
                {strings.sosSubtitle}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraButton} onPress={handleMediaPress} activeOpacity={0.9}>
            <Feather name="camera" size={28} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mediaPill} activeOpacity={0.9} onPress={handleMediaPress}>
            <Text style={[styles.mediaLabel, { fontFamily: typography.semibold }]}>
              {strings.mediaUploadFull}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  muted: {
    color: 'rgba(255,255,255,0.7)',
  },
  profile: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  sosCircle: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#DE1B25',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sosText: {
    fontSize: 46,
    color: '#fff',
    letterSpacing: 4,
  },
  sosSub: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  cameraButton: {
    width: 74,
    height: 74,
    borderRadius: 20,
    backgroundColor: '#F7E7D7',
    borderWidth: 4,
    borderColor: '#E4B67A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  mediaPill: {
    paddingHorizontal: Spacing.lg * 1.4,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: '#F0B369',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  mediaLabel: {
    color: '#fff',
    fontSize: 13,
  },
});
