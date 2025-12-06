import { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

const HERO =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=60';

export const StartScreen = () => {
  const typography = useTypography();
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');

  const goNext = () => {
    navigation.navigate('Otp', { phone });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: HERO }} style={styles.hero}>
        <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']} style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={[styles.brand, { fontFamily: typography.semibold }]}>
            Santakmochan Outreach Service
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Mobile Number"
            placeholderTextColor="rgba(255,255,255,0.9)"
            keyboardType="phone-pad"
            style={[styles.input, { fontFamily: typography.semibold }]}
          />
          <TouchableOpacity style={styles.cta} onPress={goNext} activeOpacity={0.9}>
            <Text style={[styles.ctaLabel, { fontFamily: typography.bold }]}>OTP</Text>
            <Text style={[styles.ctaSub, { fontFamily: typography.regular }]}>One-Time Password</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  hero: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  brand: {
    color: '#fff',
    fontSize: 16,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: '#fff',
    fontSize: 16,
    marginBottom: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cta: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    minWidth: 140,
  },
  ctaLabel: {
    color: '#fff',
    fontSize: 18,
  },
  ctaSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 2,
  },
});
