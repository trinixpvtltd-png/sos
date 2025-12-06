import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

export const LanguageToggleChip = memo(() => {
  const { language, toggleLanguage } = useAppContext();
  const typography = useTypography();

  return (
    <Pressable style={styles.button} onPress={toggleLanguage}>
      <Text style={[styles.label, { fontFamily: typography.semibold }]}>
        {language === 'en' ? 'EN / HI' : 'HI / EN'}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  label: {
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
});
