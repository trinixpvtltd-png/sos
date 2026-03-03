import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useIncidentsContext } from '../context/IncidentsContext';
import { AttachmentPreviewList } from '../components/AttachmentPreviewList';

const TYPES = ['injury', 'harassment', 'accident', 'fire', 'medical', 'other'];

export const SpectatorAssistScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { createSpectatorIncident } = useIncidentsContext();

  const [type, setType] = useState('injury');
  const [details, setDetails] = useState('');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addAttachment = () => {
    const attachmentType = attachments.length % 2 === 0 ? 'photo' : 'video';
    setAttachments((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}-${prev.length}`,
        type: attachmentType,
        name: `${attachmentType}_${prev.length + 1}.mock`,
      },
    ]);
  };

  const onSubmit = async () => {
    if (!details.trim()) {
      setError(strings.spectatorAssist.validation.detailsRequired);
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const incidentId = createSpectatorIncident({
        type,
        description: details.trim(),
        includeLocation,
        attachments,
      });

      setIsSubmitting(false);
      navigation.navigate('Confirmation', {
        mode: 'spectator',
        caseId: incidentId,
      });
    }, 800);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.spectatorAssist.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.spectatorAssist.subtitle}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.spectatorAssist.typeLabel}</Text>
            <View style={styles.typesWrap}>
              {TYPES.map((option) => {
                const selected = option === type;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.typeChip, selected && styles.typeChipActive]}
                    onPress={() => setType(option)}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        { fontFamily: typography.semibold },
                        selected && styles.typeTextActive,
                      ]}
                    >
                      {strings.spectatorAssist.types[option]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.spectatorAssist.detailsLabel}</Text>
            <TextInput
              value={details}
              onChangeText={setDetails}
              multiline
              style={[styles.input, { fontFamily: typography.regular }]}
              placeholder={strings.spectatorAssist.detailsPlaceholder}
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.rowSwitch}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.spectatorAssist.locationToggle}</Text>
                <Text style={[styles.helper, { fontFamily: typography.regular }]}>{strings.spectatorAssist.locationHint}</Text>
              </View>
              <Switch
                value={includeLocation}
                onValueChange={setIncludeLocation}
                trackColor={{ true: `${Colors.success}88`, false: '#D0D0D0' }}
                thumbColor={includeLocation ? Colors.success : '#F7F7F7'}
              />
            </View>
          </View>

          <AttachmentPreviewList attachments={attachments} onAdd={addAttachment} />

          {error ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={16} color={Colors.primary} />
              <Text style={[styles.errorText, { fontFamily: typography.regular }]}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.submitText, { fontFamily: typography.semibold }]}>{strings.spectatorAssist.submit}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
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
  title: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 90,
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
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  typesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    borderWidth: 1,
    borderColor: '#E2E2E4',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  typeChipActive: {
    backgroundColor: `${Colors.primary}10`,
    borderColor: `${Colors.primary}44`,
  },
  typeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  typeTextActive: {
    color: Colors.primary,
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    backgroundColor: '#fff',
    minHeight: 110,
    textAlignVertical: 'top',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
  rowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  helper: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    padding: 10,
    backgroundColor: `${Colors.primary}12`,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 12,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
  },
});
