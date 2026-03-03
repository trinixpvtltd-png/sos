import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';

const getVariant = (mode, strings) => {
  if (mode === 'spectator') {
    return {
      title: strings.confirmation.spectatorTitle,
      subtitle: strings.confirmation.spectatorSubtitle,
    };
  }

  if (mode === 'sos') {
    return {
      title: strings.confirmation.sosTitle,
      subtitle: strings.confirmation.sosSubtitle,
    };
  }

  return {
    title: strings.confirmation.reportTitle,
    subtitle: strings.confirmation.reportSubtitle,
  };
};

export const ConfirmationScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const navigation = useNavigation();
  const route = useRoute();

  const mode = route.params?.mode || 'report';
  const caseId = route.params?.caseId;
  const variant = getVariant(mode, strings);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.content}>
          <View style={styles.successBox}>
            <View style={styles.iconCircle}>
              <Feather name="check" size={36} color="#fff" />
            </View>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{variant.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{variant.subtitle}</Text>
          </View>

          <View style={styles.caseCard}>
            <Text style={[styles.caseLabel, { fontFamily: typography.regular }]}>{strings.confirmation.caseIdLabel}</Text>
            <Text style={[styles.caseValue, { fontFamily: typography.bold }]}>{caseId || strings.common.notAvailable}</Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
            >
              <Text style={[styles.primaryBtnText, { fontFamily: typography.semibold }]}>{strings.confirmation.primary}</Text>
            </TouchableOpacity>

            {caseId ? (
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate('Tabs', {
                  screen: 'Home',
                  params: {
                    screen: 'CaseDetail',
                    params: { incidentId: caseId },
                  },
                })}
              >
                <Text style={[styles.secondaryBtnText, { fontFamily: typography.semibold }]}>{strings.confirmation.secondary}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 16,
  },
  successBox: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.success,
    shadowOpacity: 0.28,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  caseCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 14,
    alignItems: 'center',
  },
  caseLabel: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  caseValue: {
    color: Colors.textPrimary,
    fontSize: 18,
    marginTop: 2,
  },
  footer: {
    gap: 10,
  },
  primaryBtn: {
    borderRadius: 14,
    backgroundColor: Colors.textPrimary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 14,
  },
  secondaryBtn: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});
