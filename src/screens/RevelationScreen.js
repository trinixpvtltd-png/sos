import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';
import { LinearGradient } from 'expo-linear-gradient';

export const RevelationScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const navigation = useNavigation();
  const [details, setDetails] = useState('');

  const onSubmit = () => {
    if (details.trim()) {
      navigation.navigate('Confirmation');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>Media Report</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>Broadcast emergency updates</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.inputCard}>
            <Text style={[styles.inputLabel, { fontFamily: typography.semibold }]}>Incident Details</Text>
            <TextInput
              style={[styles.input, { fontFamily: typography.regular }]}
              multiline
              placeholder="Describe the situation in detail..."
              placeholderTextColor={Colors.textMuted}
              value={details}
              onChangeText={setDetails}
              blurOnSubmit={false}
            />
            <View style={styles.charCount}>
              <Text style={[styles.charText, { fontFamily: typography.regular }]}>{details.length} characters</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { fontFamily: typography.bold }]}>Attach Evidence</Text>
          <View style={styles.attachmentGrid}>
            {[
              { icon: 'mic', label: 'Voice Record', color: '#5856D6' },
              { icon: 'camera', label: 'Take Photo', color: '#FF9500' },
              { icon: 'image', label: 'Use Gallery', color: '#32D74B' },
              { icon: 'video', label: 'Record Video', color: '#FF3B30' },
            ].map((item) => (
              <TouchableOpacity key={item.icon} style={styles.attachmentItem} activeOpacity={0.7}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                  <Feather name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={[styles.attachmentLabel, { fontFamily: typography.semibold }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, !details.trim() && styles.submitBtnDisabled]}
            onPress={onSubmit}
            disabled={!details.trim()}
          >
            <Text style={[styles.submitLabel, { fontFamily: typography.bold }]}>Submit Report</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: 30,
  },
  backBtn: {
    display: 'none',
  },
  headerTitle: {
    fontSize: 26,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: -2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: Colors.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
    outlineStyle: 'none',
  },
  charCount: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  charText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginTop: 30,
    marginBottom: 16,
  },
  attachmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  attachmentItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  attachmentLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '08',
    padding: 16,
    borderRadius: 16,
    marginTop: 15,
    gap: 12,
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitLabel: {
    color: '#fff',
    fontSize: 18,
  },
});

