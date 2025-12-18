import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Gradients } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

const AVATAR = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60';

const FIELDS = [
  { label: 'User ID', value: '#56382382', icon: 'hash' },
  { label: 'Full Name', value: 'Saurav Gupta', icon: 'user' },
  { label: 'Mobile Number', value: '+91 8178** **62', icon: 'phone' },
  { label: 'Emergency Contact', value: 'Brother: +91 7628** **52', icon: 'alert-circle' },
  { label: 'Address', value: 'A-203, Parasnath Society, Alpha-1, Greater Noida', icon: 'map-pin' },
  { label: 'KYC Details', value: 'Aadhaar Verified', icon: 'shield-check' },
];

export const PersonalDetailScreen = () => {
  const typography = useTypography();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>Personal Details</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>Your identity on Sankatmochan</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, width >= 768 && styles.webContainer]}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: AVATAR }} style={styles.avatar} />
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Feather name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.userName, { fontFamily: typography.bold }]}>Saurav Gupta</Text>
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={16} color={Colors.info} />
              <Text style={[styles.verifiedText, { fontFamily: typography.semibold }]}>Verified Profile</Text>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoContainer}>
            {FIELDS.map((field, index) => (
              <View key={field.label} style={[styles.infoRow, index === FIELDS.length - 1 && styles.noBorder]}>
                <View style={styles.iconBox}>
                  <Feather name={field.icon} size={20} color={Colors.textMuted} />
                </View>
                <View style={styles.infoText}>
                  <Text style={[styles.fieldLabel, { fontFamily: typography.regular }]}>{field.label}</Text>
                  <Text style={[styles.fieldValue, { fontFamily: typography.semibold }]}>{field.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
            <Text style={[styles.editBtnText, { fontFamily: typography.bold }]}>Request Profile Edit</Text>
          </TouchableOpacity>

          <Text style={[styles.footerText, { fontFamily: typography.regular }]}>
            KYC verified profiles require administrative approval for changes to ensure system integrity.
          </Text>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: 30,
    paddingBottom: Spacing.md,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  headerText: {
    flex: 1,
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
    paddingBottom: 40,
  },
  webContainer: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.info + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.info,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    gap: 16,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  editBtn: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  editBtnText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});
