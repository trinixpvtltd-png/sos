import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';

export const RevelationScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const navigation = useNavigation();
  const [details, setDetails] = useState('');

  const onSubmit = () => {
    setDetails('');
    navigation.navigate('Confirmation');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.revelationTitle}</Text>
      <TextInput
        style={[styles.input, { fontFamily: typography.regular }]}
        multiline
        placeholder={strings.revelationPlaceholder}
        placeholderTextColor={Colors.textMuted}
        value={details}
        onChangeText={setDetails}
      />
      <Text style={[styles.hint, { fontFamily: typography.regular }]}>{strings.revelationHint}</Text>
      <View style={styles.attachmentRow}>
        {[
          { icon: 'mic', label: 'Voice' },
          { icon: 'camera', label: 'Camera' },
          { icon: 'image', label: 'Gallery' },
        ].map((item) => (
          <TouchableOpacity key={item.icon} style={styles.attachmentButton}>
            <Feather name={item.icon} size={18} color={Colors.primary} />
            <Text style={[styles.attachmentLabel, { fontFamily: typography.semibold }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={[styles.buttonLabel, { fontFamily: typography.semibold }]}>
          {strings.revelationSubmit}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  input: {
    minHeight: 180,
    borderRadius: Radius.lg,
    backgroundColor: '#fff',
    padding: Spacing.md,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hint: {
    marginTop: Spacing.sm,
    color: Colors.textMuted,
    fontSize: 14,
  },
  attachmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  attachmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  attachmentLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  button: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
