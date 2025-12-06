import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useAppContext } from '../context/AppContext';
import { useStrings } from '../localization/useStrings';

export const OtpScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { setIsAuthenticated } = useAppContext();
  const [otp, setOtp] = useState('');
  const phone = route.params?.phone;

  const submit = () => {
    setIsAuthenticated(true);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.otpTitle}</Text>
      <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>
        Mobile Number linked aadhar OTP
      </Text>
      <View style={styles.otpRow}>
        {[0, 1, 2, 3].map((i) => (
          <TextInput
            key={i}
            maxLength={1}
            keyboardType="number-pad"
            style={[styles.otpBox, { fontFamily: typography.semibold }]}
            value={otp[i] ?? ''}
            onChangeText={(text) => {
              const next = (otp.slice(0, i) + text + otp.slice(i + 1)).slice(0, 4);
              setOtp(next);
            }}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={submit} activeOpacity={0.9}>
        <Text style={[styles.buttonLabel, { fontFamily: typography.semibold }]}>{strings.otpCta}</Text>
      </TouchableOpacity>
      {phone ? (
        <Text style={[styles.hint, { fontFamily: typography.regular }]}>Sent to {phone}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E4B67A',
    backgroundColor: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  hint: {
    marginTop: Spacing.md,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
