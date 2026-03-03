import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useIncidentsContext } from '../context/IncidentsContext';

export const SafeNowConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const typography = useTypography();
  const strings = useStrings();
  const { resolveIncident } = useIncidentsContext();

  const incidentId = route.params?.incidentId;
  const [note, setNote] = useState('');

  const onConfirm = () => {
    if (!incidentId) {
      navigation.goBack();
      return;
    }

    resolveIncident(incidentId, note.trim());
    navigation.replace('CaseDetail', { incidentId });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.safeNow.title}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Feather name="shield" size={34} color={Colors.success} />
          </View>

          <Text style={[styles.heading, { fontFamily: typography.bold }]}>{strings.safeNow.heading}</Text>
          <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.safeNow.subtitle}</Text>

          <TextInput
            value={note}
            onChangeText={setNote}
            style={[styles.input, { fontFamily: typography.regular }]}
            placeholder={strings.safeNow.notePlaceholder}
            placeholderTextColor={Colors.textMuted}
            multiline
          />

          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={[styles.confirmText, { fontFamily: typography.semibold }]}>{strings.safeNow.confirm}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={[styles.cancelText, { fontFamily: typography.semibold }]}>{strings.common.cancel}</Text>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E7E7E9',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 12,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${Colors.success}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: Colors.textPrimary,
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  input: {
    marginTop: 8,
    width: '100%',
    minHeight: 100,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    outlineStyle: 'none',
    textAlignVertical: 'top',
  },
  confirmBtn: {
    marginTop: 4,
    width: '100%',
    borderRadius: Radius.md,
    backgroundColor: Colors.success,
    alignItems: 'center',
    paddingVertical: 14,
  },
  confirmText: {
    color: '#fff',
    fontSize: 14,
  },
  cancelBtn: {
    width: '100%',
    borderRadius: Radius.md,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E4',
    paddingVertical: 12,
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});
