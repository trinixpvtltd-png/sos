import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(NGO_LEVELS.DISTRICT);

  const filteredNgos = useMemo(
    () => ngos.filter((ngo) => ngo.level === selectedLevel),
    [selectedLevel],
  );

  const handleContributionPress = (mode) => {
    setDrawerOpen(false);
    navigation.navigate('ContributionDetail', { mode });
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setDrawerOpen(false);
  };

  return (
    <LinearGradient colors={[Colors.surface, '#D5C1A4', '#CFB493']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.menuIcon}
            activeOpacity={0.9}
            onPress={() => setDrawerOpen(true)}
          >
            <Text style={[styles.menuLabel, { fontFamily: typography.semibold }]}>?</Text>
          </TouchableOpacity>
          <LanguageToggleChip />
        </View>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.ngo?.title}</Text>
          <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>{strings.ngo?.subtitle}</Text>
        </View>
        <ScrollView
          style={styles.list}
          contentContainerStyle={{ paddingTop: Spacing.sm, paddingBottom: Spacing.xl }}
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
        {drawerOpen ? (
          <Pressable style={styles.backdrop} onPress={() => setDrawerOpen(false)}>
            <Pressable style={styles.drawer} onPress={(e) => e.stopPropagation()}>
              <Text style={[styles.drawerTitle, { fontFamily: typography.bold }]}>Navigate</Text>
              <View style={styles.drawerSection}>
                <Text style={[styles.drawerLabel, { fontFamily: typography.semibold }]}>Contributions</Text>
                <TouchableOpacity
                  style={styles.drawerItem}
                  activeOpacity={0.9}
                  onPress={() => handleContributionPress('made')}
                >
                  <Text style={[styles.drawerItemText, { fontFamily: typography.semibold }]}>
                    {strings.contributions?.made ?? 'Contribution Made'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.drawerItem}
                  activeOpacity={0.9}
                  onPress={() => handleContributionPress('received')}
                >
                  <Text style={[styles.drawerItemText, { fontFamily: typography.semibold }]}>
                    {strings.contributions?.received ?? 'Contribution Received'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.drawerSection}>
                <Text style={[styles.drawerLabel, { fontFamily: typography.semibold }]}>Levels</Text>
                {levelOrder.map((level) => {
                  const isActive = selectedLevel === level;
                  return (
                    <TouchableOpacity
                      key={level}
                      style={[styles.drawerItem, isActive && styles.drawerItemActive]}
                      activeOpacity={0.9}
                      onPress={() => handleLevelSelect(level)}
                    >
                      <Text
                        style={[
                          styles.drawerItemText,
                          { fontFamily: typography.semibold },
                          isActive && styles.drawerItemTextActive,
                        ]}
                      >
                        {strings.ngo?.filters?.[level] ?? level}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Pressable>
          </Pressable>
        ) : null}
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
  list: {
    flex: 1,
    marginTop: 0,
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
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Spacing.md,
    paddingRight: Spacing.md,
  },
  drawer: {
    width: '72%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: -2, height: 6 },
  },
  drawerTitle: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  drawerSection: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  drawerLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerItem: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(229,57,53,0.1)',
  },
  drawerItemText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  drawerItemTextActive: {
    color: Colors.primary,
  },
});
