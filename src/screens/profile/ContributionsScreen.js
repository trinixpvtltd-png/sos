import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';

const contributions = [
  {
    id: 'mission-31',
    title: 'Rapid Response - Eastern Corridor',
    detail: 'Led a 9 member taskforce to evacuate 31 survivors within 72 minutes.',
    date: 'Sept 2023',
    impact: '31 Lives Saved',
  },
  {
    id: 'mission-26',
    title: 'Rural Helpline Synchronisation',
    detail: 'Integrated 42 helpline nodes into unified SOS router grid.',
    date: 'Aug 2023',
    impact: 'Improved Connectivity',
  },
];

export const ContributionsScreen = () => {
  const typography = useTypography();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>Field Contributions</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>Your impact in the community</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {contributions.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.impactBadge}>
                <MaterialCommunityIcons name="trophy-outline" size={14} color="#FF9500" />
                <Text style={[styles.impactText, { fontFamily: typography.bold }]}>{item.impact.toUpperCase()}</Text>
              </View>

              <Text style={[styles.cardTitle, { fontFamily: typography.bold }]}>{item.title}</Text>
              <Text style={[styles.cardDetail, { fontFamily: typography.regular }]}>{item.detail}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.dateBox}>
                  <Feather name="calendar" size={12} color={Colors.textMuted} />
                  <Text style={[styles.dateText, { fontFamily: typography.regular }]}>{item.date}</Text>
                </View>
                <TouchableOpacity style={styles.viewMore}>
                  <Text style={[styles.viewMoreText, { fontFamily: typography.semibold }]}>View report</Text>
                  <Feather name="arrow-right" size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {contributions.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="medal-outline" size={64} color={Colors.textMuted} />
              <Text style={[styles.emptyText, { fontFamily: typography.semibold }]}>No contributions yet</Text>
            </View>
          )}
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
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  impactText: {
    fontSize: 10,
    color: '#FF9500',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  cardDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewMoreText: {
    fontSize: 13,
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textMuted,
  },
});
