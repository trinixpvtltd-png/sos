import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';

const incidents = [
  {
    id: 'ticket-9021',
    label: 'SOS #9021 - Industrial belt',
    status: 'Closed',
    responseTime: '11 min',
    date: '12 Oct 2023',
    location: 'Sector 150, Noida',
  },
  {
    id: 'ticket-9018',
    label: 'SOS #9018 - Metro corridor',
    status: 'In Review',
    responseTime: 'Pending',
    date: '08 Oct 2023',
    location: 'Alpha-1, Gr. Noida',
  },
];

export const DistressHistoryScreen = () => {
  const typography = useTypography();
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusBadge, {
          backgroundColor: item.status === 'Closed' ? Colors.success + '15' : Colors.primary + '15'
        }]}>
          <Text style={[styles.statusText, {
            fontFamily: typography.bold,
            color: item.status === 'Closed' ? Colors.success : Colors.primary
          }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.dateText, { fontFamily: typography.regular }]}>{item.date}</Text>
      </View>

      <Text style={[styles.label, { fontFamily: typography.bold }]}>{item.label}</Text>

      <View style={styles.cardMeta}>
        <View style={styles.metaRow}>
          <Feather name="map-pin" size={14} color={Colors.textMuted} />
          <Text style={[styles.metaText, { fontFamily: typography.regular }]}>{item.location}</Text>
        </View>
        <View style={styles.metaRow}>
          <Feather name="clock" size={14} color={Colors.textMuted} />
          <Text style={[styles.metaText, { fontFamily: typography.regular }]}>Response: {item.responseTime}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Profile')}>
            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>SOS History</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>Track your emergency signals</Text>
          </View>
        </View>

        <FlatList
          style={styles.list}
          contentContainerStyle={styles.content}
          data={incidents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="history" size={64} color={Colors.textMuted} />
              <Text style={[styles.emptyText, { fontFamily: typography.semibold }]}>No history found</Text>
            </View>
          )}
        />
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
  list: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    letterSpacing: 1,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  label: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  cardMeta: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
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
