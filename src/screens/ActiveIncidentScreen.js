import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
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
import { EmptyStateCard } from '../components/EmptyStateCard';
import { StatusChip } from '../components/StatusChip';
import { TimelineList } from '../components/TimelineList';

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const ActiveIncidentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const typography = useTypography();
  const strings = useStrings();
  const {
    activeIncidentId,
    getIncidentById,
    getTimelineByIncidentId,
    getNotificationStatusesByIncidentId,
    retryNotification,
    addIncidentAttachment,
    escalateIncident,
    isOfflineLike,
  } = useIncidentsContext();

  const incidentId = route.params?.incidentId || activeIncidentId;
  const incident = getIncidentById(incidentId);
  const timeline = getTimelineByIncidentId(incidentId);
  const notificationStatuses = getNotificationStatusesByIncidentId(incidentId);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!incident?.createdAt) {
      return undefined;
    }

    const updateTimer = () => {
      const diffMs = Date.now() - new Date(incident.createdAt).getTime();
      setElapsed(Math.max(0, Math.floor(diffMs / 1000)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [incident?.createdAt]);

  const timelinePreview = useMemo(() => timeline.slice(-4), [timeline]);

  if (!incident) {
    return (
      <View style={styles.emptyContainer}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={{ padding: Spacing.lg }}>
            <EmptyStateCard
              icon="alert-circle"
              title={strings.activeIncident.notFoundTitle}
              description={strings.activeIncident.notFoundDescription}
              actionLabel={strings.common.back}
              onAction={() => navigation.goBack()}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.activeIncident.title}</Text>
            <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{incident.id}</Text>
          </View>
          <StatusChip status={incident.status} label={incident.status} />
        </View>

        {isOfflineLike ? (
          <View style={styles.offlineBanner}>
            <Feather name="wifi-off" size={14} color={Colors.warning} />
            <Text style={[styles.offlineText, { fontFamily: typography.semibold }]}>{strings.common.offlineMode}</Text>
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.timerCard}>
            <Text style={[styles.timerLabel, { fontFamily: typography.regular }]}>{strings.activeIncident.timerLabel}</Text>
            <Text style={[styles.timerValue, { fontFamily: typography.bold }]}>{formatDuration(elapsed)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.activeIncident.locationTitle}</Text>
            <Text style={[styles.cardText, { fontFamily: typography.regular }]}>{incident.location?.text}</Text>
            <Text style={[styles.cardMeta, { fontFamily: typography.regular }]}>
              {incident.location?.latitude}, {incident.location?.longitude}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.activeIncident.notifyTitle}</Text>
            {notificationStatuses.length === 0 ? (
              <Text style={[styles.cardText, { fontFamily: typography.regular }]}>{strings.activeIncident.noContacts}</Text>
            ) : (
              notificationStatuses.map((item) => (
                <View style={styles.notifyRow} key={item.id}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.notifyName, { fontFamily: typography.semibold }]}>{item.contactName}</Text>
                    <Text style={[styles.cardMeta, { fontFamily: typography.regular }]}>{item.channel}</Text>
                  </View>
                  <StatusChip status={item.status} label={item.status} />
                  {item.retryable ? (
                    <TouchableOpacity style={styles.retryBtn} onPress={() => retryNotification(item.id)}>
                      <Text style={[styles.retryText, { fontFamily: typography.semibold }]}>{strings.common.retry}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))
            )}
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.activeIncident.evidenceTitle}</Text>
            <View style={styles.evidenceActions}>
              <EvidenceAction
                icon="camera"
                label={strings.activeIncident.photo}
                onPress={() => addIncidentAttachment(incident.id, 'photo')}
              />
              <EvidenceAction
                icon="video"
                label={strings.activeIncident.video}
                onPress={() => addIncidentAttachment(incident.id, 'video')}
              />
              <EvidenceAction
                icon="mic"
                label={strings.activeIncident.voice}
                onPress={() => addIncidentAttachment(incident.id, 'voice')}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.activeIncident.timelineTitle}</Text>
            <TimelineList items={timelinePreview} />
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => navigation.navigate('CaseDetail', { incidentId: incident.id })}
            >
              <Text style={[styles.detailsText, { fontFamily: typography.semibold }]}>{strings.activeIncident.viewDetails}</Text>
              <Feather name="chevron-right" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.safeBtn}
            onPress={() => navigation.navigate('SafeNowConfirmation', { incidentId: incident.id })}
            accessibilityLabel={strings.activeIncident.safeNow}
          >
            <Feather name="shield" size={16} color="#fff" />
            <Text style={[styles.safeBtnText, { fontFamily: typography.semibold }]}>{strings.activeIncident.safeNow}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={() => escalateIncident(incident.id)}>
            <Text style={[styles.secondaryBtnText, { fontFamily: typography.semibold }]}>{strings.activeIncident.escalate}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => Linking.openURL('tel:112')}
          >
            <Text style={[styles.secondaryBtnText, { fontFamily: typography.semibold }]}>{strings.activeIncident.callHelpline}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const EvidenceAction = ({ icon, label, onPress }) => {
  const typography = useTypography();
  return (
    <TouchableOpacity style={styles.evidenceBtn} onPress={onPress}>
      <Feather name={icon} size={16} color="#fff" />
      <Text style={[styles.evidenceText, { fontFamily: typography.semibold }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101113',
  },
  emptyContainer: {
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
    paddingBottom: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3B3E43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
  },
  subtitle: {
    color: '#AEB2B8',
    fontSize: 12,
  },
  offlineBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    backgroundColor: '#27210F',
    borderWidth: 1,
    borderColor: '#4A3D1C',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  offlineText: {
    color: '#FFCD62',
    fontSize: 12,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
    gap: 10,
  },
  timerCard: {
    backgroundColor: '#181A1E',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#2C3037',
    padding: 14,
    alignItems: 'center',
  },
  timerLabel: {
    color: '#AEB2B8',
    fontSize: 12,
  },
  timerValue: {
    marginTop: 2,
    color: '#fff',
    fontSize: 26,
  },
  card: {
    backgroundColor: '#181A1E',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#2C3037',
    padding: 14,
    gap: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
  },
  cardText: {
    color: '#D1D4D9',
    fontSize: 13,
    lineHeight: 18,
  },
  cardMeta: {
    color: '#AEB2B8',
    fontSize: 11,
  },
  notifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#2D2F34',
    paddingTop: 8,
  },
  notifyName: {
    color: '#fff',
    fontSize: 13,
  },
  retryBtn: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#4E535B',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 11,
  },
  evidenceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  evidenceBtn: {
    flex: 1,
    borderRadius: Radius.md,
    backgroundColor: '#252932',
    borderWidth: 1,
    borderColor: '#333845',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  evidenceText: {
    color: '#fff',
    fontSize: 11,
  },
  detailsBtn: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  detailsText: {
    color: Colors.primary,
    fontSize: 13,
  },
  safeBtn: {
    backgroundColor: Colors.success,
    borderRadius: Radius.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  safeBtnText: {
    color: '#fff',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: '#1F232A',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#373C45',
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#fff',
    fontSize: 13,
  },
});
