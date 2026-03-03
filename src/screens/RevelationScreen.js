import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
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
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';
import { useDraftReportsContext } from '../context/DraftReportsContext';
import { useIncidentsContext } from '../context/IncidentsContext';
import { AttachmentPreviewList } from '../components/AttachmentPreviewList';
import { VoiceInputModal } from '../components/VoiceInputModal';
import {
  captureImageWithCamera,
  pickImageFromLibrary,
} from '../utils/mediaCapture';

const mergeAttachments = (currentList, nextList) => {
  const seen = new Set(currentList.map((item) => item.uri || item.id || item.name));
  const merged = [...currentList];

  nextList.forEach((item) => {
    const key = item.uri || item.id || item.name;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  });

  return merged;
};

export const RevelationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const strings = useStrings();
  const typography = useTypography();
  const { saveDraft, deleteDraft, getDraftById } = useDraftReportsContext();
  const { createReportIncident } = useIncidentsContext();

  const draftId = route.params?.draftId;
  const categories = strings.revelation.categories;
  const prefillSignatureRef = useRef('');

  const [category, setCategory] = useState(categories[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceVisible, setIsVoiceVisible] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showFileFallback, setShowFileFallback] = useState(false);

  const flashInfo = (message) => {
    setInfoMessage(message);
    setTimeout(() => setInfoMessage(''), 2200);
  };

  const flashSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 1800);
  };

  const appendDescription = (nextText) => {
    const normalized = nextText.trim();
    if (!normalized) {
      return;
    }

    setDescription((prev) => (prev.trim() ? `${prev.trim()}\n${normalized}` : normalized));
  };

  useEffect(() => {
    if (!draftId) {
      return;
    }

    const draft = getDraftById(draftId);
    if (!draft) {
      return;
    }

    setCategory(draft.category || categories[0]);
    setTitle(draft.title || '');
    setDescription(draft.description || '');
    setAttachments(Array.isArray(draft.attachments) ? draft.attachments : []);
  }, [draftId, getDraftById, categories]);

  useEffect(() => {
    const prefillDescription = route.params?.prefillDescription || '';
    const prefillAttachments = Array.isArray(route.params?.prefillAttachments)
      ? route.params.prefillAttachments
      : [];

    if (!prefillDescription && !prefillAttachments.length) {
      return;
    }

    const signature = JSON.stringify({
      description: prefillDescription,
      attachments: prefillAttachments.map((item) => item.uri || item.id || item.name),
    });

    if (prefillSignatureRef.current === signature) {
      return;
    }

    if (prefillDescription) {
      appendDescription(prefillDescription);
      flashSuccess(strings.revelation.voiceApplied);
    }

    if (prefillAttachments.length) {
      setAttachments((prev) => mergeAttachments(prev, prefillAttachments));
      flashSuccess(strings.revelation.imageAttached);
    }

    prefillSignatureRef.current = signature;
  }, [
    route.params?.prefillDescription,
    route.params?.prefillAttachments,
    strings.revelation.imageAttached,
    strings.revelation.voiceApplied,
  ]);

  const addMockAttachment = () => {
    const attachmentType = attachments.length % 3 === 0 ? 'photo' : attachments.length % 3 === 1 ? 'video' : 'voice';

    setAttachments((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}-${prev.length}`,
        type: attachmentType,
        name: `${attachmentType}_${prev.length + 1}.mock`,
      },
    ]);
  };

  const handleCameraCapture = async ({ captureFn, successMessage }) => {
    setError('');
    setInfoMessage('');
    setShowFileFallback(false);

    const cameraResult = await captureFn();
    if (cameraResult.ok) {
      setAttachments((prev) => mergeAttachments(prev, [cameraResult.attachment]));
      setInfoMessage('');
      setShowFileFallback(false);
      flashSuccess(successMessage);
      return;
    }

    if (cameraResult.reason === 'cancelled') {
      return;
    }

    setShowFileFallback(true);
    setInfoMessage(
      cameraResult.reason === 'permission_denied'
        ? strings.media.permissionDenied
        : strings.media.unavailable,
    );
  };

  const handleCaptureImage = async () => {
    await handleCameraCapture({
      captureFn: captureImageWithCamera,
      successMessage: strings.revelation.imageAttached,
    });
  };

  const handlePickMediaFallback = async () => {
    const pickerResult = await pickImageFromLibrary();

    if (pickerResult.ok) {
      setAttachments((prev) => mergeAttachments(prev, [pickerResult.attachment]));
      setInfoMessage('');
      setShowFileFallback(false);
      flashSuccess(strings.revelation.imageAttached);
      return;
    }

    if (pickerResult.reason === 'cancelled') {
      return;
    }

    flashInfo(strings.media.unavailable);
  };

  const handleVoiceUse = (text) => {
    appendDescription(text);
    flashSuccess(strings.revelation.voiceApplied);
  };

  const handleSaveDraft = () => {
    const draft = saveDraft({
      id: draftId,
      category,
      severity: 'Low',
      anonymity: false,
      includeLocation: true,
      title,
      description,
      attachments,
      status: 'Draft',
    });

    flashSuccess(strings.revelation.draftSaved.replace('{id}', draft.id));
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      setError(strings.revelation.validation.descriptionRequired);
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const incidentId = createReportIncident({
        category,
        severity: 'Low',
        anonymity: false,
        includeLocation: true,
        title,
        description,
        attachments,
      });

      if (draftId) {
        deleteDraft(draftId);
      }

      setIsLoading(false);
      navigation.navigate('Confirmation', {
        mode: 'report',
        caseId: incidentId,
      });
    }, 900);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>{strings.revelation.titleNew}</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>{strings.revelation.subtitleNew}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Section title={strings.revelation.categoryLabel}>
            <ChipGroup options={categories} value={category} onSelect={setCategory} />
          </Section>

          <Section title={strings.revelation.titleOptional}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={[styles.input, { fontFamily: typography.regular }]}
              placeholder={strings.revelation.titlePlaceholder}
              placeholderTextColor={Colors.textMuted}
            />
          </Section>

          <Section title={strings.revelation.descriptionRequired}>
            <View style={styles.descriptionActionRow}>
              <DescriptionAction
                icon="mic"
                label={strings.revelation.descriptionActions.voice}
                onPress={() => setIsVoiceVisible(true)}
              />
              <DescriptionAction
                icon="camera"
                label={strings.revelation.descriptionActions.capture}
                onPress={handleCaptureImage}
              />
            </View>

            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.input, styles.textArea, { fontFamily: typography.regular }]}
              placeholder={strings.revelation.descriptionPlaceholder}
              placeholderTextColor={Colors.textMuted}
            />
          </Section>

          <AttachmentPreviewList attachments={attachments} onAdd={addMockAttachment} />

          {infoMessage ? (
            <View style={styles.infoBox}>
              <View style={styles.infoContent}>
                <Feather name="info" size={15} color={Colors.info} />
                <Text style={[styles.infoText, { fontFamily: typography.regular }]}>{infoMessage}</Text>
              </View>
              {showFileFallback ? (
                <TouchableOpacity style={styles.infoActionBtn} onPress={handlePickMediaFallback}>
                  <Text style={[styles.infoActionText, { fontFamily: typography.semibold }]}>
                    {strings.media.chooseFile}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={15} color={Colors.primary} />
              <Text style={[styles.errorText, { fontFamily: typography.regular }]}>{error}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successBox}>
              <Feather name="check-circle" size={15} color={Colors.success} />
              <Text style={[styles.successText, { fontFamily: typography.regular }]}>{successMessage}</Text>
            </View>
          ) : null}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleSaveDraft}>
              <Feather name="save" size={14} color={Colors.textPrimary} />
              <Text style={[styles.secondaryText, { fontFamily: typography.semibold }]}>{strings.revelation.saveDraft}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.primaryText, { fontFamily: typography.semibold }]}>{strings.revelation.submitNow}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <VoiceInputModal
        visible={isVoiceVisible}
        onClose={() => setIsVoiceVisible(false)}
        onUseText={handleVoiceUse}
      />
    </View>
  );
};

const Section = ({ title, children }) => {
  const typography = useTypography();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { fontFamily: typography.semibold }]}>{title}</Text>
      {children}
    </View>
  );
};

const ChipGroup = ({ options, value, onSelect }) => {
  const typography = useTypography();

  return (
    <View style={styles.chipsWrap}>
      {options.map((option) => {
        const selected = option === value;

        return (
          <TouchableOpacity
            key={option}
            style={[styles.chip, selected && styles.chipActive]}
            onPress={() => onSelect(option)}
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
  );
};

const DescriptionAction = ({ icon, label, onPress }) => {
  const typography = useTypography();

  return (
    <TouchableOpacity style={styles.descriptionActionBtn} onPress={onPress}>
      <Feather name={icon} size={14} color={Colors.primary} />
      <Text style={[styles.descriptionActionText, { fontFamily: typography.semibold }]}>{label}</Text>
    </TouchableOpacity>
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
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 95,
    gap: 10,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
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
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipActive: {
    borderColor: `${Colors.primary}44`,
    backgroundColor: `${Colors.primary}10`,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  chipTextActive: {
    color: Colors.primary,
  },
  descriptionActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  descriptionActionBtn: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: `${Colors.primary}1E`,
    backgroundColor: `${Colors.primary}10`,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  descriptionActionText: {
    color: Colors.primary,
    fontSize: 12,
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  infoBox: {
    gap: 8,
    borderRadius: Radius.md,
    padding: 10,
    backgroundColor: `${Colors.info}12`,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: Colors.info,
    fontSize: 12,
    flex: 1,
  },
  infoActionBtn: {
    alignSelf: 'flex-start',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: `${Colors.info}25`,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  infoActionText: {
    color: Colors.info,
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
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    padding: 10,
    backgroundColor: `${Colors.success}12`,
  },
  successText: {
    color: Colors.success,
    fontSize: 12,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 12,
  },
  secondaryText: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  primaryBtn: {
    flex: 1,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  primaryText: {
    color: '#fff',
    fontSize: 13,
  },
});
