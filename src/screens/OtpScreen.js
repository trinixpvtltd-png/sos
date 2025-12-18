import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Gradients } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useAppContext } from '../context/AppContext';
import { useStrings } from '../localization/useStrings';
import { Feather } from '@expo/vector-icons';

const START_BG = require('../../assets/app-bg.png');

export const OtpScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { setIsAuthenticated } = useAppContext();
  const [otp, setOtp] = useState('');
  const phone = route.params?.phone;

  const submit = () => {
    if (otp.length === 4) {
      setIsAuthenticated(true);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={START_BG} style={styles.hero} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.formSection}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>Verification</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>
              Enter the 4-digit code sent to{'\n'}
              <Text style={{ color: '#fff', fontFamily: typography.semibold }}>+91 {phone}</Text>
            </Text>

            <BlurView intensity={30} tint="dark" style={styles.otpCard}>
              <View style={styles.otpRow}>
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} style={[styles.otpBoxWrapper, otp[i] && styles.otpBoxFilled]}>
                    <TextInput
                      maxLength={1}
                      autoFocus={i === 0}
                      keyboardType="number-pad"
                      style={[styles.otpBox, { fontFamily: typography.bold }]}
                      value={otp[i] ?? ''}
                      onChangeText={(text) => {
                        const next = (otp.slice(0, i) + text + otp.slice(i + 1)).slice(0, 4);
                        setOtp(next);
                      }}
                    />
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.button, otp.length < 4 && styles.buttonDisabled]}
                onPress={submit}
                activeOpacity={0.8}
                disabled={otp.length < 4}
              >
                <LinearGradient
                  colors={Gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={[styles.buttonLabel, { fontFamily: typography.bold }]}>
                    Verify & Proceed
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendBtn}>
                <Text style={[styles.resendText, { fontFamily: typography.regular }]}>
                  Didn't receive code? <Text style={{ color: Colors.primary, fontFamily: typography.semibold }}>Resend</Text>
                </Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  hero: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 40,
  },
  otpCard: {
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpBoxWrapper: {
    width: '22%',
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,59,48,0.1)',
  },
  otpBox: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    width: '100%',
    outlineStyle: 'none',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
  },
  resendBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
});

