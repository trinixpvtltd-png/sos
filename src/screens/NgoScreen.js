import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import { Colors, Gradients } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { LanguageToggleChip } from '../components/LanguageToggleChip';
import { useStrings } from '../localization/useStrings';
import { useTypography } from '../theme/typography';
import { NGO_LEVELS, ngos } from '../data/ngos';

const levelOrder = [
  NGO_LEVELS.DISTRICT,
  NGO_LEVELS.STATE,
  NGO_LEVELS.NATIONAL,
  NGO_LEVELS.GLOBAL,
];

export const NgoScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const [selectedLevel, setSelectedLevel] = useState(NGO_LEVELS.DISTRICT);

  const filteredNgos = useMemo(
    () => ngos.filter((ngo) => ngo.level === selectedLevel),
    [selectedLevel],
  );

  return (
    <LinearGradient colors={[Colors.surface, '#D5C1A4', '#CFB493']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View style={styles.menuIcon}>
            <Text style={[styles.menuLabel, { fontFamily: typography.semibold }]}>≡</Text>
          </View>
          <LanguageToggleChip />
        </View>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.ngo?.title}</Text>
          <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.ngo?.subtitle}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {levelOrder.map((level) => {
            const isActive = selectedLevel === level;
            return (
              <TouchableOpacity
                key={level}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                activeOpacity={0.9}
                onPress={() => setSelectedLevel(level)}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    { fontFamily: typography.semibold },
                    isActive && styles.filterLabelActive,
                  ]}
                >
                  {strings.ngo?.filters?.[level] ?? level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView
          style={styles.list}
          contentContainerStyle={{ paddingTop: Spacing.xs, paddingBottom: Spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          {filteredNgos.map((ngo) => (
            <View key={ngo.id} style={styles.card}>
              <Image source={{ uri: ngo.imageUrl }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { fontFamily: typography.bold }]}>{ngo.name}</Text>
                    <Text style={[styles.cardCategory, { fontFamily: typography.regular }]}>{ngo.category}</Text>
                  </View>
                  <View style={styles.levelPill}>
                    <Text style={[styles.levelLabel, { fontFamily: typography.semibold }]}>
                      {(ngo.level ?? '').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.cardDescription, { fontFamily: typography.regular }]}>{ngo.description}</Text>
                <Text style={[styles.cardLocation, { fontFamily: typography.regular }]}>{ngo.location}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.min(ngo.progress * 100, 100)}%` }]} />
                </View>
                <View style={styles.cardFooter}>
                  <Text style={[styles.raised, { fontFamily: typography.semibold }]}>
                    {strings.ngo?.raisedLabel?.(
                      ngo.raisedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
                      ngo.goalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
                    )}
                  </Text>
                  <TouchableOpacity style={styles.donateButton}>
                    <Text style={[styles.donateLabel, { fontFamily: typography.semibold }]}>Act</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  menuLabel: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  titleBlock: {
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textMuted,
  },
  filterRow: {
    marginBottom: 0,
  },
  filterContent: {
    gap: Spacing.xs,
    paddingVertical: 0,
    alignItems: 'center',
  },
  filterChip: {
    minHeight: 32,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs / 2,
    borderRadius: Radius.md,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  filterLabelActive: {
    color: '#fff',
  },
  list: {
    flex: 1,
    marginTop: -Spacing.xl * 1.6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
  },
  cardImage: {
    width: '100%',
    height: 130,
  },
  cardBody: {
    padding: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  cardCategory: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  levelPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(229,57,53,0.12)',
  },
  levelLabel: {
    fontSize: 12,
    color: Colors.primary,
  },
  cardDescription: {
    marginTop: Spacing.sm,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  cardLocation: {
    marginTop: Spacing.sm,
    color: Colors.textMuted,
    fontSize: 13,
  },
  progressTrack: {
    height: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceElevated,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  cardFooter: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  raised: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  donateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
  },
  donateLabel: {
    fontSize: 14,
    color: '#fff',
  },
});
