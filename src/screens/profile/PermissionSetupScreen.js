import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { useStrings } from '../../localization/useStrings';
import { useSafetyContext } from '../../context/SafetyContext';
import { PermissionStatusCard } from '../../components/PermissionStatusCard';
import { LoadingSkeletonCard } from '../../components/LoadingSkeletonCard';

export const PermissionSetupScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();
  const { permissionStatuses, togglePermissionStatus, isLoading, error } = useSafetyContext();

  const permissions = Object.values(permissionStatuses);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.permissions.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.permissions.subtitle}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {error ? (
            <View style={styles.errorCard}>
              <Feather name="alert-circle" size={16} color={Colors.primary} />
              <Text style={[styles.errorText, { fontFamily: typography.regular }]}>{error}</Text>
            </View>
          ) : null}

          {isLoading ? (
            <>
              <LoadingSkeletonCard lines={3} />
              <LoadingSkeletonCard lines={3} />
              <LoadingSkeletonCard lines={3} />
            </>
          ) : (
            permissions.map((permission) => (
              <PermissionStatusCard
                key={permission.key}
                permission={{
                  ...permission,
                  title: strings.permissions.cards[permission.key]?.title || permission.title,
                  description: strings.permissions.cards[permission.key]?.description || permission.description,
                }}
                onToggle={() => togglePermissionStatus(permission.key)}
                actionLabel={permission.enabled ? strings.permissions.disable : strings.permissions.enable}
              />
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 6,
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
  title: { fontSize: 24, color: Colors.textPrimary },
  subtitle: { color: Colors.textMuted, fontSize: 13 },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 80,
    gap: 10,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}12`,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 12,
  },
});
