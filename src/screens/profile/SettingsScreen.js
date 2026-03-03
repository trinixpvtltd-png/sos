import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';
import { DEMO_ROLES, useAppContext } from '../../context/AppContext';
import { useIncidentsContext } from '../../context/IncidentsContext';

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { language, toggleLanguage, demoRole, setDemoRole } = useAppContext();
  const { isOfflineLike, setIsOfflineLike } = useIncidentsContext();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.settings.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.settings.subtitle}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>{strings.settings.languageTitle}</Text>
            <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
              <Text style={[styles.rowLabel, { fontFamily: typography.semibold }]}>{strings.settings.languageToggle}</Text>
              <Text style={[styles.valueTag, { fontFamily: typography.semibold }]}>{language.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>{strings.settings.quickLinks}</Text>
            <SettingsLink
              label={strings.settings.links.safetySetup}
              onPress={() => navigation.navigate('SafetySetup')}
            />
            <SettingsLink
              label={strings.settings.links.safetySettings}
              onPress={() => navigation.navigate('SafetySettings')}
            />
            <SettingsLink
              label={strings.settings.links.emergencyContacts}
              onPress={() => navigation.navigate('EmergencyContacts')}
            />
            <SettingsLink
              label={strings.settings.links.draftReports}
              onPress={() => navigation.navigate('DraftReports')}
            />
          </View>

          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>{strings.settings.roleTitle}</Text>
            <View style={styles.rolesWrap}>
              {DEMO_ROLES.map((role) => {
                const selected = role === demoRole;
                return (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleChip, selected && styles.roleChipActive]}
                    onPress={() => setDemoRole(role)}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        { fontFamily: typography.semibold },
                        selected && styles.roleTextActive,
                      ]}
                    >
                      {strings.settings.roles[role]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>{strings.settings.devTitle}</Text>
            <TouchableOpacity style={styles.row} onPress={() => setIsOfflineLike(!isOfflineLike)}>
              <Text style={[styles.rowLabel, { fontFamily: typography.semibold }]}>{strings.settings.offlineMode}</Text>
              <Text style={[styles.valueTag, { fontFamily: typography.semibold }]}>
                {isOfflineLike ? strings.common.on : strings.common.off}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const SettingsLink = ({ label, onPress }) => {
  const typography = useTypography();
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={[styles.rowLabel, { fontFamily: typography.semibold }]}>{label}</Text>
      <Feather name="chevron-right" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
    color: Colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F7',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  valueTag: {
    color: Colors.primary,
    fontSize: 12,
  },
  rolesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    borderWidth: 1,
    borderColor: '#E2E2E4',
    borderRadius: Radius.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  roleChipActive: {
    borderColor: `${Colors.primary}44`,
    backgroundColor: `${Colors.primary}10`,
  },
  roleText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  roleTextActive: {
    color: Colors.primary,
  },
});
