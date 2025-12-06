import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTypography } from '../theme/typography';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';

export const AppHeader = memo(({ title, subtitle }) => {
  const navigation = useNavigation();
  const { toggleLanguage, language } = useAppContext();
  const typography = useTypography();

  const handleProfilePress = () => {
    const parentNav = navigation.getParent?.() ?? navigation;
    parentNav.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { fontFamily: typography.bold }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{subtitle}</Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.language} onPress={toggleLanguage}>
          <Text style={[styles.languageLabel, { fontFamily: typography.semibold }]}>
            {language.toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profile} onPress={handleProfilePress}>
          <Feather name="user" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  textBlock: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: 28,
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  language: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  languageLabel: {
    fontSize: 12,
    color: '#fff',
    letterSpacing: 1,
  },
  profile: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
