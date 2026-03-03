import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';
import { useSafetyContext } from '../../context/SafetyContext';

const COUNTDOWN_OPTIONS = [3, 5, 10];
const LANGUAGE_OPTIONS = ['EN', 'HI', 'Both'];

export const SafetySettingsScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const {
    safetySettings,
    updateSafetySettings,
    resetSafetySettings,
  } = useSafetyContext();

  const updateToggle = (key, value) => updateSafetySettings({ [key]: value });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.safetySettings.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.safetySettings.subtitle}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SettingsToggle
            label={strings.safetySettings.toggles.silentModeDefault}
            value={safetySettings.silentModeDefault}
            onChange={(value) => updateToggle('silentModeDefault', value)}
          />
          <SettingsToggle
            label={strings.safetySettings.toggles.autoRecord}
            value={safetySettings.autoRecord}
            onChange={(value) => updateToggle('autoRecord', value)}
          />
          <SettingsToggle
            label={strings.safetySettings.toggles.continuousLocationShare}
            value={safetySettings.continuousLocationShare}
            onChange={(value) => updateToggle('continuousLocationShare', value)}
          />
          <SettingsToggle
            label={strings.safetySettings.toggles.vibration}
            value={safetySettings.vibration}
            onChange={(value) => updateToggle('vibration', value)}
          />
          <SettingsToggle
            label={strings.safetySettings.toggles.fakeCallShortcut}
            value={safetySettings.fakeCallShortcut}
            onChange={(value) => updateToggle('fakeCallShortcut', value)}
          />

          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>
              {strings.safetySettings.countdownLabel}
            </Text>
            <View style={styles.chipsWrap}>
              {COUNTDOWN_OPTIONS.map((seconds) => {
                const selected = safetySettings.countdownDuration === seconds;
                return (
                  <TouchableOpacity
                    key={seconds}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => updateSafetySettings({ countdownDuration: seconds })}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { fontFamily: typography.semibold },
                        selected && styles.chipTextActive,
                      ]}
                    >
                      {seconds}s
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>
              {strings.safetySettings.messageLanguageLabel}
            </Text>
            <View style={styles.chipsWrap}>
              {LANGUAGE_OPTIONS.map((option) => {
                const selected = safetySettings.distressMessageLanguage === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => updateSafetySettings({ distressMessageLanguage: option })}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { fontFamily: typography.semibold },
                        selected && styles.chipTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={resetSafetySettings}>
            <Feather name="refresh-ccw" size={16} color={Colors.primary} />
            <Text style={[styles.resetText, { fontFamily: typography.semibold }]}>
              {strings.safetySettings.resetDefaults}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const SettingsToggle = ({ label, value, onChange }) => {
  const typography = useTypography();
  return (
    <View style={styles.rowSwitch}>
      <Text style={[styles.switchLabel, { fontFamily: typography.semibold }]}>{label}</Text>
      <Switch
        value={Boolean(value)}
        onValueChange={onChange}
        trackColor={{ true: `${Colors.success}88`, false: '#D0D0D0' }}
        thumbColor={value ? Colors.success : '#F7F7F7'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 6,
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
  title: { fontSize: 24, color: Colors.textPrimary },
  subtitle: { color: Colors.textMuted, fontSize: 13 },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 80,
    gap: 10,
  },
  rowSwitch: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  switchLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 14,
    gap: 8,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  chipActive: {
    borderColor: `${Colors.primary}44`,
    backgroundColor: `${Colors.primary}10`,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  chipTextActive: {
    color: Colors.primary,
  },
  resetBtn: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: `${Colors.primary}12`,
    borderRadius: Radius.md,
    paddingVertical: 12,
  },
  resetText: {
    color: Colors.primary,
    fontSize: 13,
  },
});
