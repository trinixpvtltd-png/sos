import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors, Gradients } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

const AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60';

const FIELDS = [
  { label: 'User ID', value: '#56382382' },
  { label: 'Name', value: 'Saurav Gupta' },
  { label: 'Mobile Number', value: '+91 8178** **62' },
  { label: 'Emergency Contact', value: 'Brother: +91 7628** **52' },
  { label: 'Address', value: 'A-203, Parasnath Society, Alpha-1, Greater Noida' },
  { label: 'KYC Details', value: 'Aadhaar' },
];

export const PersonalDetailScreen = () => {
  const typography = useTypography();

  return (
    <LinearGradient colors={Gradients.warmVertical} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: AVATAR }} style={styles.avatar} />
        {FIELDS.map((field) => (
          <View key={field.label} style={styles.field}>
            <Text style={[styles.fieldLabel, { fontFamily: typography.regular }]}>{field.label}</Text>
            <Text style={[styles.fieldValue, { fontFamily: typography.semibold }]}>{field.value}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    borderColor: '#F3B56A',
    marginBottom: Spacing.sm,
  },
  field: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#F1C18B',
  },
  fieldLabel: {
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  fieldValue: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
});
