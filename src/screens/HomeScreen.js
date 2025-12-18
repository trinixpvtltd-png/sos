import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Extrapolate,
  Easing
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Colors, Gradients } from '../theme/colors';
import { Spacing, Radius } from '../theme/metrics';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';
import { useResponsiveScale } from '../hooks';

const PulsingSOS = ({ size, onPress, strings, typography, moderateScale }) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const ringStyle = (index) => useAnimatedStyle(() => {
    // Continuous loop progress
    const progress = (pulse.value + index * 0.3) % 1;

    return {
      transform: [
        {
          scale: interpolate(progress, [0, 1], [1, 2.8], Extrapolate.CLAMP)
        }
      ],
      opacity: interpolate(progress, [0, 0.6, 1], [0.3, 0.1, 0], Extrapolate.CLAMP),
      backgroundColor: Colors.primary,
    };
  });


  return (
    <View style={[styles.sosWrapper, { width: size + 100, height: size + 100 }]}>
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={[
            styles.pulseRing,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
            ringStyle(i)
          ]}
        />
      ))}

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.sosCircle, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <LinearGradient
          colors={Gradients.sosButton}
          style={styles.sosGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.sosInnerBorder} />
          <Text style={[styles.sosText, { fontFamily: typography.bold, fontSize: moderateScale(48) }]}>
            SOS
          </Text>
          <Text style={[styles.sosSub, { fontFamily: typography.regular, fontSize: moderateScale(13) }]}>
            Emergency
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const navigation = useNavigation();
  const { width, moderateScale } = useResponsiveScale();

  const sosSize = moderateScale(180, 0.4);
  const AVATAR = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60';

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: Colors.background }} />
        <LinearGradient
          colors={['rgba(255,59,48,0.05)', 'transparent']}
          style={{ height: '40%', position: 'absolute', top: 0, left: 0, right: 0 }}
        />
      </View>

      {/* Unified Header Section */}
      <View style={styles.headerContainer}>
        <SafeAreaView edges={['top']}>
          <View style={styles.brandingBox}>
            <Text style={[styles.headerTitle, { fontFamily: typography.brand, fontSize: 48 }]}>Sankat Mochan</Text>
          </View>

          <TouchableOpacity
            style={styles.userCard}
            onPress={() => navigation.navigate('Profile', { screen: 'ProfileOverview' })}
            activeOpacity={0.9}
          >
            <Image source={{ uri: AVATAR }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { fontFamily: typography.bold }]}>Saurav Gupta</Text>
              <View style={styles.idBadge}>
                <Text style={[styles.idText, { fontFamily: typography.semibold }]}>ID: #56382382</Text>
              </View>
            </View>
            <View style={styles.cardArrow}>
              <Feather name="chevron-right" size={24} color={Colors.textMuted} />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { minHeight: '100%' }]}
      >
        {/* Main SOS Section - Centered */}
        <View style={styles.heroSection}>
          <PulsingSOS
            size={sosSize}
            onPress={() => navigation.navigate('DistressSignal', { initialTab: 'sos' })}
            strings={strings}
            typography={typography}
            moderateScale={moderateScale}
          />
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <View style={styles.actionPanel}>
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('DistressSignal', { initialTab: 'media' })}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#F0F9FF' }]}>
                <Feather name="camera" size={24} color={Colors.info} />
              </View>
              <View>
                <Text style={[styles.actionLabel, { fontFamily: typography.bold }]}>Report</Text>
                <Text style={[styles.actionSub, { fontFamily: typography.regular }]}>Evidence</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('Resources')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#F0FDF4' }]}>
                <Feather name="map-pin" size={24} color={Colors.success} />
              </View>
              <View>
                <Text style={[styles.actionLabel, { fontFamily: typography.bold }]}>Help</Text>
                <Text style={[styles.actionSub, { fontFamily: typography.regular }]}>Nearby</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    zIndex: 10,
  },
  brandingBox: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: 'rgb(255, 59, 48)',
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    zIndex: 0,
  },
  sosWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 999, // Ensure perfect circle
  },
  sosCircle: {
    elevation: 15,
    shadowColor: Colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 12 },
    overflow: 'hidden',
    backgroundColor: Colors.primary,
  },
  sosGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  sosInnerBorder: {
    ...StyleSheet.absoluteFillObject,
    margin: 8,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sosText: {
    color: '#fff',
    letterSpacing: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  sosStatusLine: {
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginVertical: 12,
    borderRadius: 1,
  },
  sosSub: {
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1.5,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 65,
    marginTop: Spacing.md,
    zIndex: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F2F2F7',
  },
  actionPanel: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
  },
  actionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  actionSub: {
    fontSize: 12,
    color: '#999',
  },
  infoSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: 20,
  },
  alertWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  alertCard: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,149,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  alertTextWrapper: {
    flex: 1,
  },
  alertTitle: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 4,
  },
  alertDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    lineHeight: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  idBadge: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  idText: {
    fontSize: 12,
    color: Colors.primary,
  },
});

