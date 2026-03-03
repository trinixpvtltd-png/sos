import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useSafetyContext } from '../context/SafetyContext';
import { useIncidentsContext } from '../context/IncidentsContext';

export const SosActivationScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { safetySettings } = useSafetyContext();
  const { createSosIncident, setSosFlowState } = useIncidentsContext();

  const [stage, setStage] = useState('idle');
  const [countdownValue, setCountdownValue] = useState(safetySettings.countdownDuration || 5);
  const [silentMode, setSilentMode] = useState(Boolean(safetySettings.silentModeDefault));
  const [fakeCallUsed, setFakeCallUsed] = useState(false);

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 850, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  useEffect(() => {
    if (stage !== 'countdown') {
      return undefined;
    }

    if (countdownValue <= 0) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setCountdownValue((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [stage, countdownValue]);

  useEffect(() => {
    if (stage !== 'countdown' || countdownValue > 0) {
      return;
    }

    const activate = async () => {
      setStage('sending');
      setSosFlowState('sending');
      const result = await createSosIncident({
        silentMode,
        fakeCallUsed,
      });
      navigation.replace('ActiveIncident', { incidentId: result.incidentId });
    };

    activate();
  }, [stage, countdownValue, silentMode, fakeCallUsed, createSosIncident, navigation, setSosFlowState]);

  const startCountdown = () => {
    setStage('countdown');
    setSosFlowState('countdown');
    setCountdownValue(safetySettings.countdownDuration || 5);
  };

  const cancelFlow = () => {
    setStage('idle');
    setSosFlowState('idle');
    setCountdownValue(safetySettings.countdownDuration || 5);
  };

  const triggerFakeCall = () => {
    setFakeCallUsed(true);
    Alert.alert(strings.sosActivation.fakeCallTitle, strings.sosActivation.fakeCallMessage);
  };

  const statusText = useMemo(() => {
    if (stage === 'countdown') {
      return strings.sosActivation.countdownLabel.replace('{seconds}', countdownValue);
    }

    if (stage === 'sending') {
      return strings.sosActivation.sending;
    }

    return strings.sosActivation.holdHint;
  }, [stage, countdownValue, strings]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.sosActivation.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.sosActivation.subtitle}</Text>
          </View>
        </View>

        <View style={styles.centerWrap}>
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <TouchableOpacity
              style={[styles.sosButton, stage !== 'idle' && styles.sosButtonActive]}
              onLongPress={startCountdown}
              delayLongPress={450}
              disabled={stage === 'sending'}
              accessibilityLabel={strings.sosActivation.accessibilityLongPress}
              accessibilityRole="button"
            >
              {stage === 'sending' ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <>
                  <Text style={[styles.sosLabel, { fontFamily: typography.bold }]}>SOS</Text>
                  <Text style={[styles.sosSub, { fontFamily: typography.semibold }]}>
                    {stage === 'countdown' ? countdownValue : strings.sosActivation.holdButtonText}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          <Text style={[styles.statusText, { fontFamily: typography.semibold }]}>{statusText}</Text>

          <View style={styles.actionsWrap}>
            <TouchableOpacity
              style={[styles.actionButton, silentMode && styles.actionButtonActive]}
              onPress={() => setSilentMode((prev) => !prev)}
            >
              <Feather name={silentMode ? 'volume-x' : 'volume-2'} size={16} color={silentMode ? '#fff' : Colors.textPrimary} />
              <Text
                style={[
                  styles.actionText,
                  { fontFamily: typography.semibold },
                  silentMode && styles.actionTextActive,
                ]}
              >
                {strings.sosActivation.silentMode}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={triggerFakeCall}
              disabled={!safetySettings.fakeCallShortcut}
            >
              <Feather name="phone-call" size={16} color={Colors.textPrimary} />
              <Text style={[styles.actionText, { fontFamily: typography.semibold }]}>
                {strings.sosActivation.fakeCall}
              </Text>
            </TouchableOpacity>
          </View>

          {stage === 'countdown' ? (
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelFlow}>
              <Feather name="x-circle" size={18} color={Colors.primary} />
              <Text style={[styles.cancelText, { fontFamily: typography.semibold }]}>{strings.sosActivation.cancel}</Text>
            </TouchableOpacity>
          ) : null}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
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
  title: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 16,
  },
  sosButton: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sosButtonActive: {
    backgroundColor: '#D93028',
  },
  sosLabel: {
    color: '#fff',
    fontSize: 48,
    letterSpacing: 2,
  },
  sosSub: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
  },
  statusText: {
    color: Colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
  },
  actionsWrap: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    paddingVertical: 12,
  },
  actionButtonActive: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  actionText: {
    color: Colors.textPrimary,
    fontSize: 13,
  },
  actionTextActive: {
    color: '#fff',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}10`,
  },
  cancelText: {
    color: Colors.primary,
    fontSize: 13,
  },
});
