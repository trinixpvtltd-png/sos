import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useSafetyContext } from '../context/SafetyContext';
import { useIncidentsContext } from '../context/IncidentsContext';
import { IncidentSummaryCard } from '../components/IncidentSummaryCard';
import { ReadinessProgressCard } from '../components/ReadinessProgressCard';
import { VoiceInputModal } from '../components/VoiceInputModal';
import { captureImageWithCamera, pickImageFromLibrary } from '../utils/mediaCapture';

const PulsingSOS = ({ onPress, typography, strings }) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 3800, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [pulse]);

  const ringStyle = (index) => useAnimatedStyle(() => {
    const progress = (pulse.value + index * 0.3) % 1;

    return {
      transform: [{ scale: interpolate(progress, [0, 1], [1, 2.9], Extrapolate.CLAMP) }],
      opacity: interpolate(progress, [0, 0.6, 1], [0.26, 0.1, 0], Extrapolate.CLAMP),
      backgroundColor: Colors.primary,
    };
  });

  return (
    <View style={styles.sosWrapper}>
      {[0, 1, 2].map((idx) => (
        <Animated.View key={idx} style={[styles.pulseRing, ringStyle(idx)]} />
      ))}
      <TouchableOpacity
        onPress={onPress}
        style={styles.sosButton}
        activeOpacity={0.9}
        accessibilityLabel={strings.home.sosAccessibility}
        accessibilityRole="button"
      >
        <LinearGradient colors={Gradients.sosButton} style={styles.sosGradient}>
          <Text style={[styles.sosLabel, { fontFamily: typography.bold }]}>SOS</Text>
          <Text style={[styles.sosHint, { fontFamily: typography.semibold }]}>{strings.home.sosHoldText}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { height: windowHeight } = useWindowDimensions();
  const { readinessChecklist, readinessProgress } = useSafetyContext();
  const { incidents } = useIncidentsContext();

  const [headerHeight, setHeaderHeight] = useState(0);
  const [isVoiceVisible, setIsVoiceVisible] = useState(false);
  const [isCapturingEvidence, setIsCapturingEvidence] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [cameraFallbackMessage, setCameraFallbackMessage] = useState('');

  const latestIncident = useMemo(() => incidents[0], [incidents]);
  const heroFoldHeight = useMemo(
    () => Math.max(360, windowHeight - headerHeight - 16),
    [windowHeight, headerHeight],
  );

  const openRevelation = (params = {}) => {
    const parent = navigation.getParent();
    if (parent?.navigate) {
      parent.navigate('Revelation', params);
      return;
    }

    navigation.navigate('Revelation', params);
  };

  const handleCaptureEvidence = async () => {
    if (isCapturingEvidence) {
      return;
    }

    setCameraFallbackMessage('');
    setIsCapturingEvidence(true);
    const result = await captureImageWithCamera();
    setIsCapturingEvidence(false);

    if (result.ok) {
      setPreviewAttachment(result.attachment);
      return;
    }

    if (result.reason === 'cancelled') {
      return;
    }

    setCameraFallbackMessage(
      result.reason === 'permission_denied'
        ? strings.media.permissionDenied
        : strings.media.unavailable,
    );
  };

  const handlePickFallbackFile = async () => {
    const result = await pickImageFromLibrary();

    if (result.ok) {
      setCameraFallbackMessage('');
      setPreviewAttachment(result.attachment);
      return;
    }

    if (result.reason === 'cancelled') {
      return;
    }

    setCameraFallbackMessage(strings.media.unavailable);
  };

  const handleUseCapturedEvidence = () => {
    if (!previewAttachment) {
      return;
    }

    const nextAttachment = previewAttachment;
    setPreviewAttachment(null);
    openRevelation({ prefillAttachments: [nextAttachment] });
  };

  const handleVoiceUse = (text) => {
    openRevelation({ prefillDescription: text });
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: Colors.background }} />
        <LinearGradient
          colors={['rgba(255,59,48,0.06)', 'transparent']}
          style={{ height: '40%', position: 'absolute', top: 0, left: 0, right: 0 }}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View
          style={styles.header}
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
        >
          <View>
            <Text style={[styles.brand, { fontFamily: typography.brand }]}>Sankat Mochan</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.homeSubtitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('Profile', { screen: 'ProfileOverview' })}
          >
            <Feather name="user" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroWrap, { minHeight: heroFoldHeight }]}>
            <PulsingSOS
              onPress={() => navigation.navigate('SosActivation')}
              typography={typography}
              strings={strings}
            />

            <View style={styles.heroActionsRow}>
              <QuickAction
                icon="mic"
                label={strings.home.quickActions.voice}
                onPress={() => setIsVoiceVisible(true)}
                compact
              />
              <QuickAction
                icon="camera"
                label={strings.home.quickActions.reportEvidence}
                onPress={handleCaptureEvidence}
                compact
                loading={isCapturingEvidence}
              />
            </View>
          </View>

          <View style={styles.cardsSection}>
            <ReadinessProgressCard
              progress={readinessProgress}
              checklist={readinessChecklist.map((item) => ({
                ...item,
                label: strings.safetySetup.checklist[item.key],
              }))}
              onPress={() => navigation.navigate('Profile', { screen: 'SafetySetup' })}
              title={strings.home.readinessTitle}
              actionLabel={strings.home.readinessAction}
            />

            {latestIncident ? (
              <IncidentSummaryCard
                incident={latestIncident}
                onPress={() => navigation.navigate('CaseDetail', { incidentId: latestIncident.id })}
                subtitle={strings.home.recentIncidentSubtitle}
              />
            ) : null}

            <View style={styles.quickGrid}>
              <QuickAction
                icon="users"
                label={strings.home.quickActions.contacts}
                onPress={() => navigation.navigate('Profile', { screen: 'EmergencyContacts' })}
              />
              <QuickAction
                icon="eye"
                label={strings.home.quickActions.spectator}
                onPress={() => navigation.navigate('SpectatorAssist')}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <VoiceInputModal
        visible={isVoiceVisible}
        onClose={() => setIsVoiceVisible(false)}
        onUseText={handleVoiceUse}
      />

      <Modal
        visible={Boolean(previewAttachment)}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewAttachment(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setPreviewAttachment(null)}
          />
          <View style={styles.modalCard}>
            <Text style={[styles.modalTitle, { fontFamily: typography.bold }]}>
              {strings.media.previewTitle}
            </Text>
            <Text style={[styles.modalSubtitle, { fontFamily: typography.regular }]}>
              {strings.media.previewSubtitle}
            </Text>

            {previewAttachment?.uri ? (
              <Image source={{ uri: previewAttachment.uri }} style={styles.previewImage} resizeMode="cover" />
            ) : null}

            <Text style={[styles.previewName, { fontFamily: typography.semibold }]} numberOfLines={1}>
              {previewAttachment?.name}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalGhostBtn}
                onPress={() => setPreviewAttachment(null)}
              >
                <Text style={[styles.modalGhostText, { fontFamily: typography.semibold }]}>
                  {strings.common.cancel}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalGhostBtn}
                onPress={() => {
                  setPreviewAttachment(null);
                  handleCaptureEvidence();
                }}
              >
                <Text style={[styles.modalGhostText, { fontFamily: typography.semibold }]}>
                  {strings.media.retake}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalPrimaryBtn} onPress={handleUseCapturedEvidence}>
                <Text style={[styles.modalPrimaryText, { fontFamily: typography.semibold }]}>
                  {strings.media.useInReport}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={Boolean(cameraFallbackMessage)}
        transparent
        animationType="fade"
        onRequestClose={() => setCameraFallbackMessage('')}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setCameraFallbackMessage('')}
          />
          <View style={styles.modalCard}>
            <View style={styles.fallbackIconWrap}>
              <Feather name="camera-off" size={22} color={Colors.primary} />
            </View>
            <Text style={[styles.modalTitle, { fontFamily: typography.bold }]}>
              {strings.media.fallbackTitle}
            </Text>
            <Text style={[styles.modalSubtitle, { fontFamily: typography.regular }]}>
              {cameraFallbackMessage}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalGhostBtn} onPress={handlePickFallbackFile}>
                <Text style={[styles.modalGhostText, { fontFamily: typography.semibold }]}>
                  {strings.media.chooseFile}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setCameraFallbackMessage('');
                  openRevelation();
                }}
              >
                <Text style={[styles.modalPrimaryText, { fontFamily: typography.semibold }]}>
                  {strings.media.openRevelation}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const QuickAction = ({ icon, label, onPress, compact = false, loading = false }) => {
  const typography = useTypography();

  return (
    <TouchableOpacity
      style={[styles.quickItem, compact && styles.quickItemCompact]}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.quickIconWrap, compact && styles.quickIconWrapCompact]}>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Feather name={icon} size={18} color={Colors.primary} />
        )}
      </View>
      <Text style={[styles.quickLabel, { fontFamily: typography.semibold }]}>{label}</Text>
    </TouchableOpacity>
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 40,
    color: Colors.primary,
    lineHeight: 40,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E7E7E9',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 100,
  },
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8,
    gap: 14,
  },
  sosWrapper: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
  },
  sosButton: {
    width: 190,
    height: 190,
    borderRadius: 95,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  sosGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosLabel: {
    color: '#fff',
    fontSize: 46,
    letterSpacing: 2,
  },
  sosHint: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  cardsSection: {
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  heroActionsRow: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    gap: 10,
    marginTop: 70,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickItemCompact: {
    flex: 1,
    width: 'auto',
    minHeight: 66,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  quickIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: `${Colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconWrapCompact: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  quickLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.34)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 430,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.97)',
    padding: Spacing.md,
    gap: 10,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#F4F4F6',
  },
  previewName: {
    color: Colors.textPrimary,
    fontSize: 13,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalGhostBtn: {
    flex: 1,
    minWidth: 110,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  modalGhostText: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  modalPrimaryBtn: {
    flex: 1.2,
    minWidth: 130,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  modalPrimaryText: {
    color: '#fff',
    fontSize: 12,
  },
  fallbackIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${Colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
