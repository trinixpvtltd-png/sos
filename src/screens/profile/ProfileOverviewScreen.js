import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';

const ProfileLink = ({ icon, label, onPress, rightLabel }) => {
  const typography = useTypography();

  return (
    <TouchableOpacity style={styles.linkItem} onPress={onPress}>
      <View style={styles.linkIconBox}>
        <Feather name={icon} size={19} color={Colors.textPrimary} />
      </View>
      <Text style={[styles.linkLabel, { fontFamily: typography.semibold }]}>{label}</Text>
      <View style={styles.linkRight}>
        {rightLabel ? <Text style={[styles.rightLabel, { fontFamily: typography.regular }]}>{rightLabel}</Text> : null}
        <Feather name="chevron-right" size={18} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

export const ProfileOverviewScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
              <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>{strings.profile.title}</Text>
              <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>{strings.profile.subtitle}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
            <Feather name="settings" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Section title={strings.profile.sections.account}>
            <ProfileLink
              icon="user"
              label={strings.profile.links.personalDetails}
              onPress={() => navigation.navigate('ProfilePersonal')}
            />
            <ProfileLink
              icon="heart"
              label={strings.profile.links.contributions}
              onPress={() => navigation.navigate('ProfileContribDetail')}
            />
            <ProfileLink
              icon="alert-triangle"
              label={strings.profile.links.sosHistory}
              onPress={() => navigation.navigate('ProfileHistory')}
            />
          </Section>

          <Section title={strings.profile.sections.safety}>
            <ProfileLink
              icon="users"
              label={strings.profile.links.emergencyContacts}
              onPress={() => navigation.navigate('EmergencyContacts')}
            />
            <ProfileLink
              icon="shield"
              label={strings.profile.links.safetySetup}
              onPress={() => navigation.navigate('SafetySetup')}
            />
            <ProfileLink
              icon="sliders"
              label={strings.profile.links.safetySettings}
              onPress={() => navigation.navigate('SafetySettings')}
            />
            <ProfileLink
              icon="file-text"
              label={strings.profile.links.draftReports}
              onPress={() => navigation.navigate('DraftReports')}
            />
            <ProfileLink
              icon="monitor"
              label={strings.profile.links.demoRoleSwitcher}
              onPress={() => navigation.navigate('Settings')}
            />
          </Section>

          <Section title={strings.profile.sections.support}>
            <ProfileLink
              icon="map-pin"
              label={strings.profile.links.emergencyServices}
              onPress={() => navigation.navigate('Home', { screen: 'AvailableService' })}
            />
            <ProfileLink icon="info" label={strings.profile.links.about} onPress={() => {}} />
          </Section>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const Section = ({ title, children }) => {
  const typography = useTypography();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { fontFamily: typography.bold }]}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    gap: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  settingsBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  headerTitle: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 90,
    gap: 14,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 12,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    marginBottom: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F3',
  },
  linkIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  linkRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rightLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});
