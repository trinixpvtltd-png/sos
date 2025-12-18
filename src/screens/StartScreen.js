import React, { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

// Use the new asset
const START_BG = require('../../assets/app-bg.png');

export const StartScreen = () => {
  const typography = useTypography();
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const { width, height } = useWindowDimensions();

  const goNext = () => {
    if (phone.length >= 10) {
      navigation.navigate('Otp', { phone });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={START_BG} style={styles.hero} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.topSection}>
            <Text style={[styles.brand, { fontFamily: typography.brand }]}>
              Sankat Mochan
            </Text>
            <Text style={[styles.tagline, { fontFamily: typography.regular }]}>
              Every second counts.{'\n'}Your companion in emergencies.
            </Text>
          </View>

          <BlurView intensity={30} tint="dark" style={styles.formCard}>
            <Text style={[styles.inputLabel, { fontFamily: typography.semibold }]}>
              Secure Sign In
            </Text>
            <View style={styles.inputContainer}>
              <View style={styles.prefix}>
                <Text style={[styles.prefixText, { fontFamily: typography.semibold }]}>+91</Text>
              </View>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Mobile Number"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="phone-pad"
                maxLength={10}
                style={[styles.input, { fontFamily: typography.semibold }]}
              />
            </View>

            <TouchableOpacity
              style={[styles.cta, phone.length < 10 && styles.ctaDisabled]}
              onPress={goNext}
              activeOpacity={0.8}
              disabled={phone.length < 10}
            >
              <LinearGradient
                colors={Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={[styles.ctaLabel, { fontFamily: typography.bold }]}>Get OTP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>

          <Text style={[styles.footerText, { fontFamily: typography.regular }]}>
            Protected by end-to-end encryption.
          </Text>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
};

import { Gradients } from '../theme/colors';

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
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 60,
  },
  topSection: {
    alignItems: 'center',
  },
  brand: {
    color: '#fff',
    fontSize: 48,
    textAlign: 'center',
  },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  formCard: {
    borderRadius: 30,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  inputLabel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  prefix: {
    paddingLeft: 16,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.2)',
  },
  prefixText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 17,
    outlineStyle: 'none',
  },
  cta: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});

