import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';
import { useSafetyContext } from '../../context/SafetyContext';
import { ReadinessProgressCard } from '../../components/ReadinessProgressCard';
import { LoadingSkeletonCard } from '../../components/LoadingSkeletonCard';

export const SafetySetupScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { readinessChecklist, readinessProgress, isLoading, error } = useSafetyContext();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.safetySetup.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.safetySetup.subtitle}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <>
              <LoadingSkeletonCard lines={4} />
              <LoadingSkeletonCard lines={2} />
            </>
          ) : (
            <ReadinessProgressCard
              progress={readinessProgress}
              checklist={readinessChecklist.map((item) => ({
                ...item,
                label: strings.safetySetup.checklist[item.key],
              }))}
              title={strings.safetySetup.readinessTitle}
            />
          )}

          {error ? (
            <View style={styles.errorCard}>
              <Feather name="alert-circle" size={16} color={Colors.primary} />
              <Text style={[styles.errorText, { fontFamily: typography.regular }]}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.actionsWrap}>
            <SetupAction
              icon="users"
              title={strings.safetySetup.actions.manageContacts}
              description={strings.safetySetup.actions.manageContactsHint}
              onPress={() => navigation.navigate('EmergencyContacts')}
            />
            <SetupAction
              icon="shield"
              title={strings.safetySetup.actions.permissionSetup}
              description={strings.safetySetup.actions.permissionSetupHint}
              onPress={() => navigation.navigate('PermissionSetup')}
            />
            <SetupAction
              icon="settings"
              title={strings.safetySetup.actions.safetySettings}
              description={strings.safetySetup.actions.safetySettingsHint}
              onPress={() => navigation.navigate('SafetySettings')}
            />
            <SetupAction
              icon="alert-triangle"
              title={strings.safetySetup.actions.testSos}
              description={strings.safetySetup.actions.testSosHint}
              onPress={() => navigation.navigate('SosActivation')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const SetupAction = ({ icon, title, description, onPress }) => {
  const typography = useTypography();

  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Feather name={icon} size={18} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionTitle, { fontFamily: typography.semibold }]}>{title}</Text>
        <Text style={[styles.actionDesc, { fontFamily: typography.regular }]}>{description}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={Colors.textMuted} />
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
    gap: 12,
  },
  actionsWrap: {
    gap: 10,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
  },
  actionDesc: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}12`,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 12,
  },
});
