import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';
import { useAppContext } from '../context/AppContext';

const PHASES = {
  idle: 'idle',
  listening: 'listening',
  processing: 'processing',
  result: 'result',
};

export const VoiceInputModal = ({
  visible,
  onClose,
  onUseText,
}) => {
  const strings = useStrings();
  const typography = useTypography();
  const { language } = useAppContext();

  const [phase, setPhase] = useState(PHASES.idle);
  const [transcript, setTranscript] = useState('');
  const [manualText, setManualText] = useState('');
  const [message, setMessage] = useState('');

  const recognitionRef = useRef(null);
  const listeningTimeoutRef = useRef(null);
  const processingTimeoutRef = useRef(null);
  const phaseRef = useRef(PHASES.idle);
  const transcriptRef = useRef('');
  const manualTextRef = useRef('');

  const speechRecognitionCtor = useMemo(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return null;
    }

    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }, []);

  const speechSupported = Boolean(speechRecognitionCtor);

  const clearTimers = () => {
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
      listeningTimeoutRef.current = null;
    }

    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
  };

  const resetState = () => {
    clearTimers();
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current = null;
    }
    setPhase(PHASES.idle);
    phaseRef.current = PHASES.idle;
    setTranscript('');
    transcriptRef.current = '';
    setManualText('');
    manualTextRef.current = '';
    setMessage('');
  };

  useEffect(() => {
    if (!visible) {
      resetState();
    }

    return () => {
      clearTimers();
      if (recognitionRef.current) {
        recognitionRef.current.stop?.();
        recognitionRef.current = null;
      }
    };
  }, [visible]);

  const moveToResult = (value) => {
    const normalized = value.trim();
    setPhase(PHASES.result);
    phaseRef.current = PHASES.result;
    setTranscript(normalized || strings.voice.mockTranscript);
    transcriptRef.current = normalized || strings.voice.mockTranscript;
    setMessage(
      speechSupported
        ? strings.voice.messages.resultReady
        : strings.voice.messages.fallbackReady,
    );
  };

  const startMockCapture = () => {
    setMessage(strings.voice.messages.fallbackListening);
    setPhase(PHASES.listening);
    phaseRef.current = PHASES.listening;

    listeningTimeoutRef.current = setTimeout(() => {
      setPhase(PHASES.processing);
      phaseRef.current = PHASES.processing;
      setMessage(strings.voice.messages.processing);

      processingTimeoutRef.current = setTimeout(() => {
        moveToResult(manualTextRef.current);
      }, 900);
    }, 1500);
  };

  const startListening = () => {
    clearTimers();
    setTranscript('');
    transcriptRef.current = '';
    setMessage('');

    if (!speechSupported) {
      startMockCapture();
      return;
    }

    try {
      const recognition = new speechRecognitionCtor();
      recognitionRef.current = recognition;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const nextTranscript = Array.from(event.results)
          .map((result) => result[0]?.transcript || '')
          .join(' ')
          .trim();

        setTranscript(nextTranscript);
        transcriptRef.current = nextTranscript;
      };

      recognition.onerror = () => {
        setMessage(strings.voice.messages.fallbackUnavailable);
        startMockCapture();
      };

      recognition.onend = () => {
        if (phaseRef.current !== PHASES.listening) {
          return;
        }

        setPhase(PHASES.processing);
        phaseRef.current = PHASES.processing;
        setMessage(strings.voice.messages.processing);

        processingTimeoutRef.current = setTimeout(() => {
          moveToResult(transcriptRef.current || manualTextRef.current);
        }, 700);
      };

      setPhase(PHASES.listening);
      phaseRef.current = PHASES.listening;
      setMessage(strings.voice.messages.listening);
      recognition.start();
    } catch (error) {
      startMockCapture();
    }
  };

  const stopListening = () => {
    clearTimers();

    if (speechSupported && recognitionRef.current) {
      phaseRef.current = PHASES.listening;
      recognitionRef.current.stop();
      return;
    }

    if (phaseRef.current === PHASES.listening) {
      setPhase(PHASES.processing);
      phaseRef.current = PHASES.processing;
      setMessage(strings.voice.messages.processing);

      processingTimeoutRef.current = setTimeout(() => {
        moveToResult(manualTextRef.current);
      }, 700);
    }
  };

  const handleUse = () => {
    const finalText = (transcriptRef.current || manualTextRef.current).trim();
    if (!finalText) {
      return;
    }

    onUseText(finalText);
    onClose();
  };

  const statusLabelMap = {
    [PHASES.idle]: strings.voice.states.idle,
    [PHASES.listening]: strings.voice.states.listening,
    [PHASES.processing]: strings.voice.states.processing,
    [PHASES.result]: strings.voice.states.result,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Feather
              name={phase === PHASES.listening ? 'mic' : 'mic-off'}
              size={26}
              color={Colors.primary}
            />
          </View>

          <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.voice.title}</Text>
          <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.voice.subtitle}</Text>

          <View style={styles.statusChip}>
            <Text style={[styles.statusText, { fontFamily: typography.semibold }]}>
              {statusLabelMap[phase]}
            </Text>
          </View>

          {message ? (
            <Text style={[styles.message, { fontFamily: typography.regular }]}>{message}</Text>
          ) : null}

          <TextInput
            value={phase === PHASES.result ? transcript : manualText}
            onChangeText={(value) => {
              if (phase === PHASES.result) {
                setTranscript(value);
                transcriptRef.current = value;
                return;
              }

              setManualText(value);
              manualTextRef.current = value;
            }}
            placeholder={strings.voice.placeholder}
            placeholderTextColor={Colors.textMuted}
            multiline
            style={[styles.input, { fontFamily: typography.regular }]}
          />

          <View style={styles.primaryActions}>
            {phase === PHASES.idle || phase === PHASES.result ? (
              <TouchableOpacity style={styles.controlBtn} onPress={startListening}>
                <Feather name="mic" size={15} color={Colors.primary} />
                <Text style={[styles.controlText, { fontFamily: typography.semibold }]}>
                  {strings.voice.actions.start}
                </Text>
              </TouchableOpacity>
            ) : null}

            {phase === PHASES.listening ? (
              <TouchableOpacity style={styles.controlBtn} onPress={stopListening}>
                <Feather name="pause-circle" size={15} color={Colors.primary} />
                <Text style={[styles.controlText, { fontFamily: typography.semibold }]}>
                  {strings.voice.actions.stop}
                </Text>
              </TouchableOpacity>
            ) : null}

            {phase === PHASES.processing ? (
              <View style={[styles.controlBtn, styles.controlBtnDisabled]}>
                <Feather name="loader" size={15} color={Colors.textMuted} />
                <Text style={[styles.controlTextMuted, { fontFamily: typography.semibold }]}>
                  {strings.voice.actions.processing}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.controlBtn} onPress={resetState}>
              <Feather name="rotate-ccw" size={15} color={Colors.textPrimary} />
              <Text style={[styles.controlTextDark, { fontFamily: typography.semibold }]}>
                {strings.voice.actions.retry}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
              <Text style={[styles.secondaryText, { fontFamily: typography.semibold }]}>
                {strings.voice.actions.cancel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                !((transcriptRef.current || manualTextRef.current).trim()) && styles.primaryBtnDisabled,
              ]}
              onPress={handleUse}
              disabled={!((transcriptRef.current || manualTextRef.current).trim())}
            >
              <Text style={[styles.primaryText, { fontFamily: typography.semibold }]}>
                {strings.voice.actions.useDescription}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 430,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
    backgroundColor: 'rgba(255,255,255,0.97)',
    padding: Spacing.md,
    gap: 10,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,59,48,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 20,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  statusChip: {
    alignSelf: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,59,48,0.1)',
  },
  statusText: {
    color: Colors.primary,
    fontSize: 11,
  },
  message: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  input: {
    minHeight: 96,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
    outlineStyle: 'none',
  },
  primaryActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  controlBtn: {
    flex: 1,
    minWidth: 110,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  controlBtnDisabled: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  controlText: {
    color: Colors.primary,
    fontSize: 12,
  },
  controlTextDark: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  controlTextMuted: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  primaryBtn: {
    flex: 1.25,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    backgroundColor: 'rgba(255,59,48,0.45)',
  },
  primaryText: {
    color: '#fff',
    fontSize: 12,
  },
});
