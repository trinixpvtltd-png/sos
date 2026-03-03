import React, { useMemo, useState } from 'react';
import {
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';
import { useContactsContext } from '../../context/ContactsContext';

const RELATIONS = ['Family', 'Friend', 'Guardian', 'Police', 'Neighbor', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const PHONE_REGEX = /^[+]?\d[\d\s-]{2,14}$/;

export const AddEditEmergencyContactScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const typography = useTypography();
  const strings = useStrings();
  const { contacts, addContact, updateContact, findDuplicatePhone } = useContactsContext();

  const mode = route.params?.mode || 'add';
  const contactId = route.params?.contactId;
  const existingContact = contacts.find((contact) => contact.id === contactId);

  const [name, setName] = useState(existingContact?.name || '');
  const [phone, setPhone] = useState(existingContact?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(existingContact?.alternatePhone || '');
  const [relation, setRelation] = useState(existingContact?.relation || 'Family');
  const [priority, setPriority] = useState(existingContact?.priority || 'Medium');
  const [isActiveForSos, setIsActiveForSos] = useState(Boolean(existingContact?.isActiveForSos ?? true));
  const [notes, setNotes] = useState(existingContact?.notes || '');
  const [errors, setErrors] = useState({});

  const duplicate = useMemo(() => findDuplicatePhone(phone, existingContact?.id), [
    phone,
    existingContact?.id,
    findDuplicatePhone,
  ]);

  const validate = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = strings.contacts.validation.nameRequired;
    }

    if (!phone.trim()) {
      nextErrors.phone = strings.contacts.validation.phoneRequired;
    } else if (!PHONE_REGEX.test(phone.trim())) {
      nextErrors.phone = strings.contacts.validation.phoneInvalid;
    }

    if (alternatePhone.trim() && !PHONE_REGEX.test(alternatePhone.trim())) {
      nextErrors.alternatePhone = strings.contacts.validation.phoneInvalid;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      alternatePhone: alternatePhone.trim(),
      relation,
      priority,
      isActiveForSos,
      notes: notes.trim(),
    };

    if (mode === 'edit' && existingContact) {
      updateContact(existingContact.id, payload);
    } else {
      addContact(payload);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>
              {mode === 'edit' ? strings.contacts.editTitle : strings.contacts.addTitle}
            </Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.contacts.formSubtitle}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FormInput
            label={strings.contacts.fields.name}
            value={name}
            onChangeText={setName}
            placeholder={strings.contacts.placeholders.name}
            error={errors.name}
          />

          <FormInput
            label={strings.contacts.fields.phone}
            value={phone}
            onChangeText={setPhone}
            placeholder={strings.contacts.placeholders.phone}
            keyboardType="phone-pad"
            error={errors.phone}
          />

          {duplicate ? (
            <View style={styles.warningBox}>
              <Feather name="alert-triangle" size={15} color={Colors.warning} />
              <Text style={[styles.warningText, { fontFamily: typography.regular }]}>
                {strings.contacts.validation.duplicateWarning.replace('{name}', duplicate.name)}
              </Text>
            </View>
          ) : null}

          <FormInput
            label={strings.contacts.fields.alternatePhone}
            value={alternatePhone}
            onChangeText={setAlternatePhone}
            placeholder={strings.contacts.placeholders.alternatePhone}
            keyboardType="phone-pad"
            error={errors.alternatePhone}
          />

          <ChipSelect
            label={strings.contacts.fields.relation}
            options={RELATIONS}
            value={relation}
            onSelect={setRelation}
            labels={strings.contacts.relationLabels}
          />

          <ChipSelect
            label={strings.contacts.fields.priority}
            options={PRIORITIES}
            value={priority}
            onSelect={setPriority}
            labels={strings.contacts.priorityLabels}
          />

          <View style={styles.rowSwitch}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchLabel, { fontFamily: typography.semibold }]}>
                {strings.contacts.fields.activeForSos}
              </Text>
              <Text style={[styles.switchHint, { fontFamily: typography.regular }]}> {strings.contacts.activeHint}</Text>
            </View>
            <Switch
              value={isActiveForSos}
              onValueChange={setIsActiveForSos}
              trackColor={{ true: `${Colors.success}88`, false: '#D0D0D0' }}
              thumbColor={isActiveForSos ? Colors.success : '#F7F7F7'}
            />
          </View>

          <FormInput
            label={strings.contacts.fields.notes}
            value={notes}
            onChangeText={setNotes}
            placeholder={strings.contacts.placeholders.notes}
            multiline
            numberOfLines={4}
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />

          <View style={styles.footerActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={[styles.cancelText, { fontFamily: typography.semibold }]}>{strings.common.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={[styles.saveText, { fontFamily: typography.semibold }]}>{strings.common.save}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const FormInput = ({ label, error, style, ...props }) => {
  const typography = useTypography();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { fontFamily: typography.semibold }]}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, { fontFamily: typography.regular }, style]}
        placeholderTextColor={Colors.textMuted}
      />
      {error ? <Text style={[styles.errorText, { fontFamily: typography.regular }]}>{error}</Text> : null}
    </View>
  );
};

const ChipSelect = ({ label, value, options, onSelect, labels }) => {
  const typography = useTypography();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { fontFamily: typography.semibold }]}>{label}</Text>
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
                {labels?.[option] ? labels[option] : option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
    paddingBottom: 4,
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
    paddingBottom: 80,
    gap: 12,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E6E6E8',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
  errorText: {
    color: Colors.primary,
    fontSize: 12,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF8E7',
    borderRadius: Radius.md,
    padding: 10,
  },
  warningText: {
    flex: 1,
    color: '#A87000',
    fontSize: 12,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E6E6E8',
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  chipActive: {
    backgroundColor: `${Colors.primary}10`,
    borderColor: `${Colors.primary}40`,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  chipTextActive: {
    color: Colors.primary,
  },
  rowSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E6E6E8',
    padding: 12,
  },
  switchLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  switchHint: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  footerActions: {
    marginTop: 4,
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 14,
  },
});
